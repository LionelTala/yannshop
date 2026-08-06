import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ProductCard from '@/Components/ProductCard';
import FloatingCart from '@/Components/FloatingCart';

interface Product {
    id: number;
    name: string;
    slug: string;
    primary_image: string;
    price: number;
    promo_price: number | null;
    category: { name: string };
}

interface WelcomeProps {
    popularProducts: Product[];
    promoProducts: Product[];
}

Welcome.layout = (page: React.ReactNode) => (
    <PublicLayout socials={{
        facebook: 'https://facebook.com/yannshop',
        instagram: 'https://instagram.com/yannshop',
        whatsapp: 'https://wa.me/237691234567'
    }}>
        {page}
    </PublicLayout>
);

export default function Welcome({ popularProducts, promoProducts }: WelcomeProps) {
    const siteUrl = 'https://yannshop.com'; // remplace par ton vrai domaine
    const pageTitle = 'YannShop - Boutique en ligne à Yaoundé et Douala';
    const pageDescription = 'Achetez en ligne chez YannShop et faites-vous livrer rapidement à Yaoundé et Douala. Découvrez nos produits de qualité et nos promotions du moment.';

    // Données structurées : identité du site, exploitées par Google pour le
    // "Knowledge Panel" et l'affichage d'une barre de recherche interne
    // dans les résultats (Sitelinks Search Box).
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'YannShop',
        url: siteUrl,
        logo: `${siteUrl}/logo.webp`,
        sameAs: [
            'https://facebook.com/yannshop',
            'https://instagram.com/yannshop',
        ],
        areaServed: ['Yaoundé', 'Douala'],
    };

    return (
        <div className="flex flex-col">
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={siteUrl} />

                {/* Open Graph : aperçus de partage WhatsApp/Facebook/Instagram — canaux clés au Cameroun */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:url" content={siteUrl} />
                <meta property="og:image" content={`${siteUrl}/logo.webp`} />
                <meta property="og:locale" content="fr_FR" />

                {/* Twitter Card (aussi utilisé par certains agrégateurs) */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />

                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Head>

            <div className="fixed bottom-10 right-8 z-50">
                <FloatingCart />
            </div>

            {/* SECTION 1 : Présentation boutique */}
            <section className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 bg-white">
                <div className="max-w-4xl">
                    <h1 className="text-5xl sm:text-6xl font-bold text-yann-blue leading-tight mb-6">
                        Bienvenue chez <br />
                        <span className="text-yann-cyan">YannShop</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                        Votre boutique en ligne de confiance à Yaoundé et Douala.
                        Découvrez nos produits de qualité et faites-vous livrer directement à votre porte.
                    </p>
                    <Link href="/shop" className="bg-yann-blue text-white px-8 py-3.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                        Découvrir nos produits
                    </Link>
                </div>
            </section>

            {/* SECTION 2 : Produits en promo */}
            {promoProducts.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-3xl font-bold text-yann-blue">Promos du moment</h2>
                            <Link href="/shop" className="text-yann-cyan font-medium hover:underline">Voir tout</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {promoProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* SECTION 3 : Produits populaires */}
            {popularProducts.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-3xl font-bold text-yann-blue">Produits populaires</h2>
                            <Link href="/shop" className="text-yann-cyan font-medium hover:underline">Voir tout</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {popularProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </div>
    );
}
