"use client"

import { useState } from 'react';
import { withPublicLayout } from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

CartPage.layout = withPublicLayout;

export default function CartPage() {
    const { items, total, count, removeFromCart, updateQuantity } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Gestion des images locales
    const getImageSrc = (src: string) => {
        if (!src) return '/placeholder.svg';
        if (src.startsWith('http')) return src;
        return `/storage/${src}`;
    };

    // Prix affiché (promo ou normal)
    const getDisplayPrice = (product: any) => {
        return product.promo_price && product.promo_price > 0
            ? product.promo_price
            : product.price;
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-10">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="size-5" />
                </Link>
                <h1 className="text-balance text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                    Mon Panier
                </h1>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card py-20 text-center shadow-sm">
                    <ShoppingBag className="size-12 text-muted-foreground" />
                    <h2 className="text-xl font-bold text-card-foreground">Votre panier est vide</h2>
                    <p className="max-w-sm text-sm text-muted-foreground">
                        Ajoutez des produits depuis notre boutique et retrouvez-les ici.
                    </p>
                    <Link
                        href="/shop"
                        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Découvrir les produits
                    </Link>
                </div>
            ) : (
                <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                    {/* Liste des produits */}
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
                                <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-secondary">
                                    <img
                                        src={getImageSrc(item.product.primary_image)}
                                        alt={item.product.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-card-foreground">{item.product.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(getDisplayPrice(item.product))} / unité
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                className="flex size-8 items-center justify-center rounded-full border border-input bg-background hover:bg-secondary transition-colors"
                                            >
                                                <Minus className="size-3.5" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                className="flex size-8 items-center justify-center rounded-full border border-input bg-background hover:bg-secondary transition-colors"
                                            >
                                                <Plus className="size-3.5" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.product.id)}
                                            className="text-destructive hover:text-destructive/80 transition-colors"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Résumé du panier */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm h-fit">
                        <h2 className="text-lg font-bold text-card-foreground mb-4">Résumé</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Sous-total</span>
                                <span className="font-medium text-card-foreground">
                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(total)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Livraison</span>
                                <span className="font-medium text-green-600">Gratuite</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border flex justify-between text-base font-bold">
                            <span className="text-card-foreground">Total</span>
                            <span className="text-primary">
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(total)}
                            </span>
                        </div>
                        <Link
                            href="/checkout"
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Passer la commande
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
