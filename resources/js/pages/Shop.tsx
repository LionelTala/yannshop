import { Head } from '@inertiajs/react';
import { withPublicLayout } from '@/Layouts/PublicLayout';
import { ProductsBrowser } from '@/Components/ProductsBrowser';

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

interface ShopProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        total?: number; // ajouté : manquait alors qu'il était déjà utilisé plus bas
    };
    categories: Category[];
    filters: {
        category: string;
        search: string | null;
    };
}

Shop.layout = withPublicLayout;

export default function Shop({ products, categories, filters }: ShopProps) {
    const siteUrl = 'https://yannshop.com'; // remplace par ton vrai domaine

    // Nombre réel de résultats, avec repli sûr si le backend ne renvoie pas
    // "total" (évite le "undefined produit(s) trouvé(s)").
    const resultsCount = products.total ?? products.data.length;

    const activeCategory = filters.category
        ? categories.find((c) => String(c.id) === String(filters.category))
        : null;

    // --- Titre/description dynamiques selon le contexte (recherche > catégorie > vue générale) ---
    let pageTitle = 'Tous nos produits - YannShop';
    let pageDescription = 'Découvrez notre sélection de produits de qualité, livrables à Yaoundé et Douala.';
    let heading = 'Tous nos produits';
    let subheading = "Filtrez par catégorie ou parcourez l'ensemble du catalogue.";

    if (filters.search) {
        pageTitle = `Résultats pour "${filters.search}" - YannShop`;
        pageDescription = `${resultsCount} produit(s) trouvé(s) pour "${filters.search}" chez YannShop, livraison à Yaoundé et Douala.`;
        heading = `Résultats pour "${filters.search}"`;
        subheading = `${resultsCount} produit(s) trouvé(s) pour votre recherche.`;
    } else if (activeCategory) {
        pageTitle = `${activeCategory.name} - YannShop`;
        pageDescription = `Découvrez nos produits ${activeCategory.name} disponibles à Yaoundé et Douala, avec livraison rapide.`;
        heading = activeCategory.name;
        subheading = pageDescription;
    }

    const currentPage = products.current_page ?? 1;
    const fullTitle = currentPage > 1 ? `${pageTitle} - Page ${currentPage}` : pageTitle;

    // Canonical auto-référencé : chaque combinaison filtre/recherche/page est
    // une page de contenu distincte, pas un doublon à fusionner.
    const canonicalUrl = typeof window !== 'undefined'
        ? `${siteUrl}${window.location.pathname}${window.location.search}`
        : `${siteUrl}/shop`;

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: products.data.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${siteUrl}/product/${product.slug}`,
            name: product.name,
        })),
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <Head>
                <title>{fullTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={canonicalUrl} />

                {/* Pas d'indexation pour les résultats de recherche : contenu
                    généré dynamiquement par requête utilisateur, sans valeur
                    de destination stable pour Google. */}
                {filters.search && <meta name="robots" content="noindex, follow" />}

                <meta property="og:type" content="website" />
                <meta property="og:title" content={fullTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:url" content={canonicalUrl} />

                {products.data.length > 0 && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                    />
                )}
            </Head>

            <header className="mb-8">
                <h1 className="text-balance text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                    {heading}
                </h1>
                <p className="mt-2 text-muted-foreground">
                    {subheading}
                </p>
            </header>
            <ProductsBrowser
                products={products}
                categories={categories}
                filters={filters}
                baseUrl="/shop"
            />
        </div>
    );
}
