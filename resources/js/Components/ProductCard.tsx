"use client"

import { Link } from '@inertiajs/react';
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string | null;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    promo_price: number | null;
    primary_image: string;
    category: Category;
}

interface ProductCardProps {
    product: Product;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(price);
};

const getImageSrc = (src: string) => {
    if (!src) return '/placeholder.svg';
    if (src.startsWith('http')) return src;
    return `/storage/${src}`;
};

export function ProductCard({ product }: ProductCardProps) {
    const { add } = useCart();

    return (
        <Link
            href={`/product/${product.slug}`}
            className="flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer h-[420px] sm:h-[480px]"
        >
            {/* Image : 70% de la hauteur */}
            <div className="relative w-full h-[70%] overflow-hidden bg-secondary">
                {product.promo_price && product.promo_price > 0 && (
                    <span className="absolute left-3 sm:left-4 top-3 sm:top-4 z-10 rounded-full bg-accent px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-accent-foreground">
                        Promo
                    </span>
                )}
                <img
                    src={getImageSrc(product.primary_image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Contenu : 30% de la hauteur */}
            <div className="flex flex-col justify-between h-[30%] p-4 bg-card">
                <h3 className="text-sm sm:text-base font-bold text-card-foreground line-clamp-1">{product.name}</h3>

                <div className="flex items-baseline gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-primary">
                        {formatPrice(product.promo_price && product.promo_price > 0 ? product.promo_price : product.price)}
                    </span>
                    {product.promo_price && product.promo_price > 0 && (
                        <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.price)}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            add(product);
                        }}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-primary text-primary-foreground py-1.5 text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                        <ShoppingBag className="size-3.5" />
                        Ajouter
                    </button>
                    <div className="flex items-center justify-center rounded-full border border-primary bg-transparent py-1.5 text-xs sm:text-sm font-semibold text-primary hover:bg-primary/10 transition-colors">
                        Détail
                    </div>
                </div>
            </div>
        </Link>
    )
}
