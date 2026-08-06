import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ProductCard from '@/Components/ProductCard';
import CategoryFilter from '@/Components/CategoryFilter';
import FloatingCart from '@/Components/FloatingCart';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    primary_image: string;
    price: number;
    promo_price: number | null;
    category: { name: string };
}

interface ShopProps {
    products: {
        data: Product[];
        meta?: {
            current_page: number;
            last_page: number;
            links: { url: string | null; label: string; active: boolean }[];
        };
    };
    categories: Category[];
    filters: {
        category: string;
    };
}

Shop.layout = (page: React.ReactNode) => (
    <PublicLayout socials={{
        facebook: 'https://facebook.com/yannshop',
        instagram: 'https://instagram.com/yannshop',
        whatsapp: 'https://wa.me/237691234567'
    }}>
        {page}
    </PublicLayout>
);

export default function Shop({ products, categories, filters }: ShopProps) {
    const siteUrl = 'https://yannshop.com'; // remplace par ton vrai domaine

    // Retrouve le nom lisible de la catégorie active, pour personnaliser
    // le titre/la description plutôt que d'afficher un texte générique.
    const activeCategory = filters.category
        ? categories.find((c) => String(c.id) === String(filters.category))
        : null;

    const currentPage = products.meta?.current_page ?? 1;

    const pageTitle = activeCategory
        ? `${activeCategory.name} - YannShop`
        : 'Nos Produits - YannShop';

    const pageDescription = activeCategory
        ? `Découvrez nos produits ${activeCategory.name} disponibles à Yaoundé et Douala, avec livraison rapide.`
        : 'Découvrez notre sélection de produits de qualité, livrables à Yaoundé et Douala.';

    const fullTitle = currentPage > 1 ? `${pageTitle} - Page ${currentPage}` : pageTitle;

    // URL canonique auto-référencée : chaque combinaison filtre + page est une
    // page de contenu distincte et légitime, pas un doublon à fusionner.
    const canonicalUrl = typeof window !== 'undefined'
        ? `${siteUrl}${window.location.pathname}${window.location.search}`
        : siteUrl + '/shop';

    // Liens de pagination précédente/suivante pour le head (aide certains
    // moteurs à comprendre la séquence de pages).
    const prevLink = products.meta?.links?.find((l) => l.label.includes('Previous') || l.label.includes('&laquo;'));
    const nextLink = products.meta?.links?.find((l) => l.label.includes('Next') || l.label.includes('&raquo;'));

    // Données structurées : liste de produits affichés sur cette page,
    // avec prix (promo si présent) — aide Google à comprendre le contenu
    // de la grille, potentiellement éligible à des extraits enrichis.
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: products.data.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${siteUrl}/shop/${product.slug}`,
            name: product.name,
        })),
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Head>
                <title>{fullTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={canonicalUrl} />

                {prevLink?.url && <link rel="prev" href={`${siteUrl}${prevLink.url}`} />}
                {nextLink?.url && <link rel="next" href={`${siteUrl}${nextLink.url}`} />}

                <meta property="og:type" content="website" />
                <meta property="og:title" content={fullTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:url" content={canonicalUrl} />

                {products.data.length > 0 && (
                    <script type="application/ld+json">
                        {JSON.stringify(structuredData)}
                    </script>
                )}
            </Head>

            <div className="fixed bottom-10 right-8 z-50">
                <FloatingCart />
            </div>

            {/* Titre et description */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-yann-blue">
                    {activeCategory ? activeCategory.name : 'Nos Produits'}
                </h1>
                <p className="text-gray-500 mt-2">
                    {pageDescription}
                </p>
            </div>

            {/* Filtres par catégorie */}
            <CategoryFilter categories={categories} currentCategory={filters.category} />

            {/* Grille de produits */}
            {products.data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.data.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-lg">Aucun produit trouvé dans cette catégorie.</p>
                    <Link href="/shop" className="mt-4 inline-block text-yann-cyan font-medium hover:underline">
                        Voir tous les produits
                    </Link>
                </div>
            )}

            {/* Pagination */}
            {products?.meta?.links && products.meta.last_page > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                    {products.meta.links.map((link, index) =>
                        link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                    link.active
                                        ? 'bg-yann-cyan text-white border-yann-cyan'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-yann-cyan hover:text-yann-cyan'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            // Pas de lien réel disponible (ex: "Précédent" sur la page 1) :
                            // rendu en <span> non cliquable plutôt qu'un Link vers "#"
                            // qui provoquait un saut de page inutile.
                            <span
                                key={index}
                                className="px-4 py-2 rounded-lg border text-sm font-medium bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )
                    )}
                </div>
            )}

        </div>
    );
}
