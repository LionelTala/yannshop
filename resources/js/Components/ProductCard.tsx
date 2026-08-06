import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '@/contexts/CartContext';

interface Product {
    id: number;
    name: string;
    slug: string;
    primary_image: string;
    price: number;
    promo_price: number | null;
    category: {
        name: string;
    };
}

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    // Calcul du prix affiché
    const displayPrice = product.promo_price && product.promo_price > 0
        ? product.promo_price
        : product.price;

    // Gestion de l'image (chemin local via storage)
    const imageSrc = product.primary_image.startsWith('http')
        ? product.primary_image
        : `/storage/${product.primary_image}`;

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-gray-100 hover:border-yann-cyan/20 h-full flex flex-col group">

            {/* Image du produit */}
            <Link href={`/product/${product.slug}`} className="block relative h-52 bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                    src={imageSrc}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge Promo si applicable */}
                {product.promo_price && product.promo_price > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        -{Math.round((1 - product.promo_price / product.price) * 100)}%
                    </span>
                )}
            </Link>

            {/* Infos produit */}
            <div className="flex-grow flex flex-col justify-between">
                <div>
                    <Link href={`/product/${product.slug}`}>
                        <h3 className="font-semibold text-yann-blue text-lg line-clamp-1 group-hover:text-yann-cyan transition-colors cursor-pointer">
                            {product.name}
                        </h3>
                    </Link>
                    <p className="text-xs text-gray-400 mt-1">{product.category?.name || 'Catégorie'}</p>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                    {product.promo_price && product.promo_price > 0 ? (
                        <>
                            <span className="text-yann-cyan font-bold text-lg">
                                {new Intl.NumberFormat('fr-FR').format(product.promo_price)} FCFA
                            </span>
                            <span className="text-gray-400 line-through text-sm">
                                {new Intl.NumberFormat('fr-FR').format(product.price)} FCFA
                            </span>
                        </>
                    ) : (
                        <span className="text-yann-blue font-bold text-lg">
                            {new Intl.NumberFormat('fr-FR').format(product.price)} FCFA
                        </span>
                    )}
                </div>

                {/* --- BOUTONS D'ACTION --- */}
                <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
                    <Link
                        href={`/product/${product.slug}`}
                        className="flex items-center justify-center gap-2 bg-gray-100 text-yann-blue py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                        <FontAwesomeIcon icon={faEye} size="sm" />
                        Détail
                    </Link>
                    <button
                        onClick={() => addToCart({
                            id: product.id,
                            name: product.name,
                            price: displayPrice,
                            primary_image: product.primary_image
                        }, 1)}
                        className="flex items-center justify-center gap-2 bg-yann-cyan text-white py-2 rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={faCartPlus} size="sm" />
                        Ajouter
                    </button>
                </div>
            </div>
        </div>
    );
}
