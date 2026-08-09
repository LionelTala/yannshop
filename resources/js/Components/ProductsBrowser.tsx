"use client"

import { Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductGridSection } from "@/Components/ProductGridSection"

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

interface ProductsBrowserProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: Category[];
    filters: {
        category: string;
    };
    baseUrl?: string;
}

export function ProductsBrowser({ products, categories, filters, baseUrl = "/shop" }: ProductsBrowserProps) {
    const active = filters?.category || 'all';

    const filterOptions = [
        { id: 'all', name: "Tout", slug: 'all' },
        ...categories.map((c) => ({ id: String(c.id), name: c.name, slug: c.slug }))
    ];

    const currentProducts = products?.data || [];

    function changeFilter(slug: string, id?: string) {
        const categoryParam = slug === 'all' ? undefined : (id || slug);
        router.get(baseUrl, { category: categoryParam, page: 1 });
    }

    function changePage(page: number) {
        const categoryParam = active === 'all' ? undefined : active;
        router.get(baseUrl, { page: page, category: categoryParam });
    }

    return (
        <div>
            {/* --- Filtres (Chips) --- */}
            <div className="mb-8 flex flex-wrap gap-2">
                {filterOptions.map((f) => (
                    <button
                        key={f.slug}
                        onClick={() => changeFilter(f.slug, f.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                            active === f.slug || (active === f.id && f.slug !== 'all')
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:text-primary"
                        }`}
                    >
                        {f.name}
                    </button>
                ))}
            </div>

            {/* --- Grille de produits (desktop + mobile), déléguée au composant partagé --- */}
            <ProductGridSection products={currentProducts} />

            {/* --- PAGINATION LARAVEL --- */}
            {products.last_page > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                        onClick={() => changePage(products.current_page - 1)}
                        disabled={products.current_page <= 1}
                        className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-primary shadow-sm disabled:opacity-50"
                    >
                        <ChevronLeft className="size-4" />
                        Précédent
                    </button>
                    <span className="text-sm text-muted-foreground">
                        Page {products.current_page} sur {products.last_page}
                    </span>
                    <button
                        onClick={() => changePage(products.current_page + 1)}
                        disabled={products.current_page >= products.last_page}
                        className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-primary shadow-sm disabled:opacity-50"
                    >
                        Suivant
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            )}

            {currentProducts.length === 0 && (
                <p className="py-16 text-center text-muted-foreground">Aucun produit dans cette catégorie.</p>
            )}
        </div>
    )
}
