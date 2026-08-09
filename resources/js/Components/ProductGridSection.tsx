"use client"

import { useCart } from "@/contexts/CartContext"
import { Link } from '@inertiajs/react'
import { ShoppingBag } from "lucide-react"

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

interface ProductGridSectionProps {
    products: Product[];
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(price);
};

const getImageSrc = (src: string) => {
    if (!src) return '/placeholder.svg';
    if (src.startsWith('http')) return src;
    return `/storage/${src}`;
};

// --- Mobile : Carte ultra immersive plein écran avec description ---
function MobileProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    return (
        <Link
            href={`/product/${product.slug}`}
            className="flex flex-col overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-xl mb-6 hover:shadow-2xl transition-shadow cursor-pointer h-[82vh] min-h-[580px] max-h-[700px]"
        >
            {/* Image : 68% de la hauteur */}
            <div className="relative w-full h-[68%] overflow-hidden bg-secondary">
                {product.promo_price && product.promo_price > 0 && (
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-md">
                        Promo
                    </span>
                )}
                <img
                    src={getImageSrc(product.primary_image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Contenu : 32% de la hauteur (Titre, Prix, Description, Boutons) */}
            <div className="flex flex-col justify-between h-[32%] p-4 bg-card">
                <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-card-foreground line-clamp-1">{product.name}</h3>
                        <div className="flex items-baseline gap-1.5 shrink-0">
                            <span className="text-base font-extrabold text-primary">
                                {formatPrice(product.promo_price && product.promo_price > 0 ? product.promo_price : product.price)}
                            </span>
                            {product.promo_price && product.promo_price > 0 && (
                                <span className="text-xs text-muted-foreground line-through">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Extrait de la description visible */}
                    {product.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {product.description}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product, 1);
                        }}
                        className="flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-2 text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <ShoppingBag className="size-3.5" />
                        Ajouter
                    </button>
                    <div className="flex items-center justify-center rounded-full border border-primary bg-transparent py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors">
                        Détail
                    </div>
                </div>
            </div>
        </Link>
    )
}

// --- Desktop : Grille classique avec description également visible ---
function DesktopProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    return (
        <Link
            href={`/product/${product.slug}`}
            className="flex flex-col rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden h-[520px]"
        >
            {/* Image : 65% de la hauteur */}
            <div className="relative w-full h-[65%] overflow-hidden bg-secondary">
                {product.promo_price && product.promo_price > 0 && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                        Promo
                    </span>
                )}
                <img
                    src={getImageSrc(product.primary_image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Contenu : 35% de la hauteur */}
            <div className="flex flex-col justify-between h-[35%] p-4 bg-card">
                <div className="space-y-1">
                    <h3 className="text-base font-bold text-card-foreground line-clamp-1">{product.name}</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-base font-extrabold text-primary">
                            {formatPrice(product.promo_price && product.promo_price > 0 ? product.promo_price : product.price)}
                        </span>
                        {product.promo_price && product.promo_price > 0 && (
                            <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                    {product.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {product.description}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product, 1);
                        }}
                        className="flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-1.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                        <ShoppingBag className="size-3.5" />
                        Ajouter
                    </button>
                    <div className="flex items-center justify-center rounded-full border border-primary bg-transparent py-1.5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors">
                        Détail
                    </div>
                </div>
            </div>
        </Link>
    )
}

// --- Composant Principal ---
export function ProductGridSection({ products }: ProductGridSectionProps) {
    return (
        <>
            {/* DESKTOP : Grille classique */}
            <div className="hidden sm:grid grid-cols-2 gap-6 md:grid-cols-3 max-w-7xl mx-auto">
                {products.map((p) => (
                    <DesktopProductCard key={p.id} product={p} />
                ))}
            </div>

            {/* MOBILE : Cartes ultra-immersives grand format */}
            <div className="sm:hidden px-2 pb-8 space-y-6">
                {products.map((p) => (
                    <MobileProductCard key={p.id} product={p} />
                ))}
            </div>
        </>
    )
}
