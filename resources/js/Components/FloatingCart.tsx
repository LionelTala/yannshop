import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes, faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '@/contexts/CartContext';
import { Link } from '@inertiajs/react';

export default function FloatingCart() {
    const { items, total, count, removeFromCart, updateQuantity } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    // Fonction pour gérer le chemin de l'image (locale ou externe)
    const getImageSrc = (src: string) => {
    if (!src) return '/images/placeholder.jpg';
    // Si c'est déjà une URL (http/https), on la garde
    if (src.startsWith('http')) return src;
    // Si le chemin commence déjà par /storage/, on le garde tel quel
    if (src.startsWith('/storage/')) return src;
    // Sinon (ancien format), on ajoute le préfixe
    return `/storage/${src}`;
};

    // Si le panier est vide et fermé, on affiche juste le bouton
    if (count === 0 && !isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-10 right-6 z-50 bg-yann-cyan text-white w-14 h-14 rounded-full shadow-lg shadow-cyan-200/50 hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
            >
                <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
            </button>
        );
    }

    return (
        <>
            {/* Bouton flottant (avec compteur) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-10 right-6 z-50 bg-yann-blue text-white w-14 h-14 rounded-full shadow-[0_10px_30px_rgba(15,43,91,0.4)] hover:shadow-[0_10px_40px_rgba(15,43,91,0.6)] hover:scale-110 transition-all duration-300 flex items-center justify-center relative"
            >
                <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 border-white">
                        {count}
                    </span>
                )}
            </button>

            {/* Modale du panier */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl max-h-[80vh] flex flex-col overflow-hidden animate-slideUp">

                        {/* En-tête */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-yann-blue">Mon Panier</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>
                        </div>

                        {/* Liste des produits */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {items.length === 0 ? (
                                <p className="text-center text-gray-500 py-10">Votre panier est vide.</p>
                            ) : (
                                items.map((item) => (
                                    <div key={item.product.id} className="flex items-center gap-4 border-b border-gray-50 pb-4">
                                        {/* IMAGE ADAPTÉE */}
                                        <img
                                            src={getImageSrc(item.product.primary_image)}
                                            alt={item.product.name}
                                            className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-yann-blue line-clamp-1">{item.product.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                                >
                                                    <FontAwesomeIcon icon={faMinus} className="text-xs" />
                                                </button>
                                                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                                >
                                                    <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Intl.NumberFormat('fr-FR').format(item.product.price * item.quantity)} FCFA
                                            </p>
                                        </div>
                                        <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600 transition-colors">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pied de page */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-semibold text-gray-600">Total</span>
                                <span className="text-2xl font-bold text-yann-cyan">
                                    {new Intl.NumberFormat('fr-FR').format(total)} FCFA
                                </span>
                            </div>
                            <Link
                                href="/checkout"
                                className="block w-full bg-yann-cyan text-white text-center py-3 rounded-xl font-semibold hover:bg-cyan-600 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Passer la commande
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
