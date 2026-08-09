"use client"

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, ReactNode } from "react"
import { Check } from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────────────

interface Product {
    id: number;
    name: string;
    slug?: string;
    description?: string | null;
    price: number;
    promo_price?: number | null;
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
const getProductPrice = (product: Product) => {
    return product.promo_price != null && product.promo_price > 0
        ? product.promo_price
        : product.price;
};

const CartContext = createContext<CartContextType | null>(null);

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
        if (!Array.isArray(parsed)) throw new Error('Format invalide');
        const valid = parsed.filter(isValidCartItem);
        if (valid.length !== parsed.length) {
            console.warn(`Panier : ${parsed.length - valid.length} article(s) corrompu(s) ignoré(s)`);
            storage.setItem(STORAGE_KEY, JSON.stringify(valid));
        }
        return valid;
    } catch (error) {
        console.error('Erreur chargement panier, réinitialisation :', error);
        storage.removeItem(STORAGE_KEY);
        return [];
    }
}

// ─── Provider ───────────────────────────────────────────────────────────

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const hasLoadedRef = useRef(false);
    const toastTimerRef = useRef<number | null>(null);

    // Charger le panier depuis localStorage au démarrage
    useEffect(() => {
        const storage = getSafeStorage();
        if (storage) {
            setItems(readCartFromStorage(storage));
        }
        hasLoadedRef.current = true;
        setIsLoaded(true);
    }, []);

    // Sauvegarder à chaque modification, seulement après le chargement initial
    useEffect(() => {
        if (!hasLoadedRef.current) return;
        const storage = getSafeStorage();
        if (!storage) return;
        try {
            storage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Impossible de sauvegarder le panier :', error);
        }
    }, [items]);

    // Synchronisation multi-onglets
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

    const showToast = useCallback((message: string) => {
        setToast(message);
        if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
        toastTimerRef.current = window.setTimeout(() => setToast(null), 2600);
    }, []);

    // --- Ajouter un produit ---
     const addToCart = useCallback((product: Product, quantity: number = 1) => {
        if (quantity <= 0) return;

        setItems((prevItems) => {
            const existingItem = prevItems.find(item => item.product.id === product.id);

            if (existingItem) {
                return prevItems.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { product, quantity }];
        });

        showToast(`${product.name} ajouté au panier`);
    }, []); // <-- [] pour éviter la recréation

    // --- Supprimer un produit ---
    const removeFromCart = useCallback((productId: number) => {
        setItems((prevItems) => prevItems.filter(item => item.product.id !== productId));
    }, []);

    // --- Mettre à jour la quantité ---
    const updateQuantity = useCallback((productId: number, quantity: number) => {
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
    }, [removeFromCart]);

    // --- Vider le panier ---
    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    // --- Calculs dérivés ---
    const total = useMemo(() => {
    return items.reduce(
        (sum, item) => sum + getProductPrice(item.product) * item.quantity,
        0
    );
}, [items]);
    const count = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const value = useMemo(
        () => ({ items, total, count, isLoaded, addToCart, removeFromCart, updateQuantity, clearCart }),
        [items, total, count, isLoaded, addToCart, removeFromCart, updateQuantity, clearCart]
    );

    return (
        <CartContext.Provider value={value}>
            {children}
            {/* Toast flottant */}
            <div
                aria-live="polite"
                className={`fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 md:bottom-8 transition-all duration-300 ${
                    toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
                }`}
            >
                {toast && (
                    <div className="flex items-center gap-3 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30">
                        <span className="flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                            <Check className="size-3.5" strokeWidth={3} />
                        </span>
                        {toast}
                    </div>
                )}
            </div>
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};
