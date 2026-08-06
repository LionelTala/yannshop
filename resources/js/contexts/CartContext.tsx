import React, { createContext, useContext, useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import { useToast } from './ToastContext'; // <-- AJOUT

// ─── Types ──────────────────────────────────────────────────────────────

interface Product {
    id: number;
    name: string;
    price: number;
    primary_image: string;
    stock?: number;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    total: number;
    count: number;
    isLoaded: boolean;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'yannshop_cart';

// ─── Helpers ────────────────────────────────────────────────────────────

const isBrowser = typeof window !== 'undefined';

function getSafeStorage(): Storage | null {
    if (!isBrowser) return null;
    try {
        const testKey = '__yannshop_test__';
        window.localStorage.setItem(testKey, '1');
        window.localStorage.removeItem(testKey);
        return window.localStorage;
    } catch {
        return null;
    }
}

function isValidCartItem(value: unknown): value is CartItem {
    if (typeof value !== 'object' || value === null) return false;
    const item = value as Partial<CartItem>;
    if (typeof item.quantity !== 'number' || item.quantity <= 0) return false;
    const p = item.product as Partial<Product> | undefined;
    if (!p || typeof p.id !== 'number' || typeof p.name !== 'string' || typeof p.price !== 'number') {
        return false;
    }
    return true;
}

function readCartFromStorage(storage: Storage): CartItem[] {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) throw new Error('Format invalide (attendu: tableau)');

        const valid = parsed.filter(isValidCartItem);
        if (valid.length !== parsed.length) {
            console.warn(`Panier: ${parsed.length - valid.length} article(s) corrompu(s) ignoré(s)`);
            storage.setItem(STORAGE_KEY, JSON.stringify(valid));
        }
        return valid;
    } catch (error) {
        console.error('Erreur chargement panier, réinitialisation:', error);
        storage.removeItem(STORAGE_KEY);
        return [];
    }
}

// ─── Provider ───────────────────────────────────────────────────────────

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { showToast } = useToast(); // <-- UTILISATION DU TOAST
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const hasLoadedRef = useRef(false);

    useEffect(() => {
        const storage = getSafeStorage();
        if (storage) {
            setItems(readCartFromStorage(storage));
        }
        hasLoadedRef.current = true;
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!hasLoadedRef.current) return;
        const storage = getSafeStorage();
        if (!storage) return;
        try {
            storage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Impossible de sauvegarder le panier:', error);
        }
    }, [items]);

    useEffect(() => {
        if (!isBrowser) return;
        const handleStorage = (event: StorageEvent) => {
            if (event.key !== STORAGE_KEY) return;
            const storage = getSafeStorage();
            if (!storage) return;
            setItems(readCartFromStorage(storage));
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Ajouter un produit
    const addToCart = (product: Product, quantity: number = 1) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find(item => item.product.id === product.id);

            const productToStore = {
                ...product,
                primary_image: product.primary_image.startsWith('http')
                    ? product.primary_image
                    : `/storage/${product.primary_image}`
            };

            if (existingItem) {
                return prevItems.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { product: productToStore, quantity }];
        });

        // FEEDBACK : Toast de confirmation
        showToast(`${product.name} ajouté au panier !`, 'success');
    };

    const removeFromCart = (productId: number) => {
        setItems((prevItems) => prevItems.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems((prevItems) =>
            prevItems.map(item => {
                if (item.product.id !== productId) return item;
                const capped = item.product.stock != null
                    ? Math.min(quantity, item.product.stock)
                    : quantity;
                return { ...item, quantity: capped };
            })
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = useMemo(() => {
        return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }, [items]);

    const count = useMemo(() => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }, [items]);

    return (
        <CartContext.Provider value={{
            items,
            total,
            count,
            isLoaded,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart doit être utilisé dans un CartProvider');
    }
    return context;
};
