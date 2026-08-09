import { Head } from '@inertiajs/react';
import { withPublicLayout } from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { ArrowRight, Truck, ShieldCheck, Headphones } from 'lucide-react';
import { SectionHeader } from '@/Components/SectionHeader';
import { ProductGridSection } from '@/Components/ProductGridSection';
import { CategoryCard } from '@/Components/CategoryCard';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
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

interface WelcomeProps {
    promoProducts: Product[];
    popularProducts: Product[];
    categories: Category[];
}

Welcome.layout = withPublicLayout;

export default function Welcome({ promoProducts, popularProducts, categories }: WelcomeProps) {
    const siteUrl = 'https://yannshop.com'; // remplace par ton vrai domaine
    const pageTitle = 'YannShop - Boutique en ligne à Yaoundé et Douala';
    const pageDescription = 'Achetez en ligne chez YannShop et faites-vous livrer rapidement à Yaoundé et Douala. Produits de qualité, paiement à la livraison, support 7j/7.';

    // LocalBusiness plutôt qu'un simple Organization générique : plus pertinent
    // pour le référencement local, avec les zones desservies explicitement listées.
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'YannShop',
        url: siteUrl,
        image: `${siteUrl}/logo.webp`,
        priceRange: 'FCFA',
        areaServed: [
            { '@type': 'City', name: 'Yaoundé' },
            { '@type': 'City', name: 'Douala' },
        ],
        sameAs: [
            'https://facebook.com/yannshop',
            'https://instagram.com/yannshop',
        ],
    };

    return (
        <div>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={siteUrl} />

                <meta property="og:type" content="website" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:url" content={siteUrl} />
                <meta property="og:image" content={`${siteUrl}/logo.webp`} />
                <meta property="og:locale" content="fr_FR" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </Head>

            {/* Hero */}
            <section className="relative overflow-hidden bg-primary text-primary-foreground">
                <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-16 size-72 rounded-full bg-accent/20 blur-3xl" />
                <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 sm:py-20">
                    <span className="w-fit rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent">
                        🚀 Nouveautés
                    </span>
                    {/* h1 conservé identique au pageTitle en substance : bon signal SEO
                        (cohérence entre le titre de la page et le titre visible) */}
                    <h1 className="max-w-2xl text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                        Votre boutique en ligne de confiance à Yaoundé et Douala
                    </h1>
                    <p className="max-w-xl text-pretty text-base text-primary-foreground/80 sm:text-lg">
                        Découvrez notre sélection de produits exclusifs. Commandez en quelques clics,
                        livraison rapide garantie.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105"
                        >
                            Découvrir les produits
                            <ArrowRight className="size-4" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                        >
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </section>

            {/* Avantages */}
            <section className="border-b border-border bg-card">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-3">
                    {[
                        { icon: Truck, title: "Livraison rapide", text: "Partout, en un temps record" },
                        { icon: ShieldCheck, title: "Paiement sécurisé", text: "À la livraison ou en ligne" },
                        { icon: Headphones, title: "Support 7j/7", text: "Une équipe à votre écoute" },
                    ].map((f) => (
                        <div key={f.title} className="flex items-center gap-3">
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                                <f.icon className="size-5" />
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-card-foreground">{f.title}</p>
                                <p className="text-xs text-muted-foreground">{f.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="mx-auto max-w-6xl px-4">
                {/* Promos */}
                {promoProducts.length > 0 && (
                    <section className="py-12">
                        <SectionHeader
                            title="Produits en promo"
                            subtitle="Profitez de nos meilleures offres du moment"
                            href="/shop"
                        />
                        <ProductGridSection products={promoProducts} />
                    </section>
                )}

                {/* Populaires */}
                {popularProducts.length > 0 && (
                    <section className="py-4 pb-12">
                        <SectionHeader
                            title="Produits populaires"
                            subtitle="Les préférés de nos clients"
                            href="/shop"
                        />
                        <ProductGridSection products={popularProducts} />
                    </section>
                )}

                {/* Catégories */}
                {categories.length > 0 && (
                    <section className="py-4 pb-12">
                        <SectionHeader
                            title="Quel type de produit vous intéresse ?"
                            subtitle="Explorez nos catégories"
                            href="/categories"
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {categories.map((c) => (
                                <CategoryCard key={c.id} category={c} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
