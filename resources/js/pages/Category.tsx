import { withPublicLayout } from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
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

interface CategoryPageProps {
    category: Category;
    products: Product[];
    others: Category[];
}

CategoryPage.layout =  withPublicLayout;

export default function CategoryPage({ category, products, others }: CategoryPageProps) {
    // Gestion de l'image de la catégorie (Hero)
    const heroImage = category.image
        ? (category.image.startsWith('http') ? category.image : `/storage/${category.image}`)
        : '/placeholder.svg';

    return (
        <div>
            {/* Hero */}

 <section className="relative isolate overflow-hidden h-[350px] sm:h-[450px]">
    {/* Image de fond */}
    <div className="absolute inset-0">
        <img
            src={heroImage}
            alt={category.name}
            sizes="100vw"
            className="h-full w-full object-cover"
         />
    </div>

    {/* Couche bleue sombre uniforme sur TOUT le fond */}
    <div className="absolute inset-0 bg-primary/90" />

    {/* Texte aligné à gauche */}
    <div className="relative flex h-full w-full items-center">
        <div className="mx-auto flex w-full max-w-6xl flex-col justify-center px-4">
            <h1 className="max-w-2xl text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {category.name}
            </h1>
            <p className="mt-2 max-w-xl text-pretty text-lg text-white/90 sm:text-xl">
                {category.description}
            </p>
        </div>
    </div>
</section>

            <div className="mx-auto max-w-6xl px-4">
                {/* Produits */}
                <section className="py-12">
                    <SectionHeader
                        title={`Produits — ${category.name}`}
                        subtitle={`${products.length} article(s) disponible(s)`}
                    />
                    {products.length > 0 ? (
                        <ProductGridSection products={products} />
                    ) : (
                        <p className="py-12 text-center text-muted-foreground">
                            Aucun produit dans cette catégorie pour le moment.
                        </p>
                    )}
                </section>

                {/* Autres catégories */}
                <section className="py-4 pb-12">
                    <SectionHeader title="Découvrir d'autres catégories" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {others.map((c) => (
                            <CategoryCard key={c.id} category={c} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
