import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
}

interface CategoryCardProps {
    category: Category;
}

const getImageSrc = (src: string | null) => {
    if (!src) return '/placeholder.svg';
    if (src.startsWith('http')) return src;
    return `/storage/${src}`;
};

export function CategoryCard({ category }: CategoryCardProps) {
    return (
        <div className="group flex items-stretch overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:shadow-primary/10">
            <div className="relative w-28 shrink-0 overflow-hidden bg-secondary sm:w-40">
                <img
                    src={getImageSrc(category.image)}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            <div className="flex flex-1 flex-col justify-center gap-2 p-4 sm:p-5">
                <h3 className="text-base font-bold text-card-foreground sm:text-lg">{category.name}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{category.description}</p>
                <Link
                    href={`/category/${category.slug}`} // <-- Pointe vers la route Laravel
                    className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                    Voir
                    <ArrowRight className="size-4" />
                </Link>
            </div>
        </div>
    );
}
