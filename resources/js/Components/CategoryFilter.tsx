import { Link } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface CategoryFilterProps {
    categories: Category[];
    currentCategory: string;
}

export default function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-8">
            <Link
                href="/shop"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentCategory === 'all'
                    ? 'bg-yann-cyan text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
                Tous les produits
            </Link>

            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`/shop?category=${category.id}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        currentCategory === String(category.id)
                        ? 'bg-yann-cyan text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    {category.name}
                </Link>
            ))}
        </div>
    );
}
