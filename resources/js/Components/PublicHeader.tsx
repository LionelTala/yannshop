"use client"

import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Home, Package, Receipt, Mail, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const nav = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/shop", label: "Produits", icon: Package },
    { href: "/orders", label: "Commandes", icon: Receipt },
    { href: "/contact", label: "Contact", icon: Mail },
];

function isActive(url: string, href: string) {
    if (href === "/") return url === "/";
    return url.startsWith(href);
}

export function SiteHeader() {
    const { url } = usePage();
    const { count } = useCart();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/shop', { search: searchQuery.trim() });
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">

                {/* --- LOGO RÉEL --- */}
                <Link href="/" className="flex items-center gap-2.5">
                    <img src="/logo.webp" alt="YannShop Logo" className="size-9 rounded-full object-cover" />
                    <span className="text-lg font-extrabold tracking-tight text-primary">
                        Yann<span className="text-accent">Shop</span>
                    </span>
                </Link>

                {/* --- NAVIGATION DESKTOP AVEC ICÔNES --- */}
                <nav className="hidden items-center gap-1 md:flex">
                    {nav.map((item) => {
                        const active = isActive(url, item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                    active ? "bg-secondary text-primary" : "text-muted-foreground hover:text-primary"
                                }`}
                            >
                                <Icon className="size-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* --- ACTIONS (Recherche & Panier) --- */}
                <div className="flex items-center gap-1">

                    {/* CHAMP DE RECHERCHE */}
                    <form
                        onSubmit={handleSearch}
                        className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
                            isSearchOpen ? 'max-w-[200px] opacity-100 mr-2' : 'max-w-0 opacity-0'
                        }`}
                    >
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher..."
                            className="w-full rounded-full border border-input bg-background px-4 py-1.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                            autoFocus={isSearchOpen}
                        />
                    </form>

                    {/* Bouton Loupe */}
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        aria-label="Rechercher"
                        className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                    >
                        <Search className="size-5" />
                    </button>

                    <Link
                        href="/cart"
                        aria-label="Panier"
                        className="relative flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                    >
                        <ShoppingBag className="size-5" />
                        {count > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
                                {count}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}

export function MobileTabBar() {
    const { url } = usePage();

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur md:hidden">
            <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
                {nav.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(url, item.href);
                    return (
                        <li key={item.href} className="flex-1">
                            <Link
                                href={item.href}
                                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                                    active ? "text-primary" : "text-muted-foreground"
                                }`}
                            >
                                <span
                                    className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                                        active ? "bg-secondary" : ""
                                    }`}
                                >
                                    <Icon className="size-5" />
                                </span>
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
