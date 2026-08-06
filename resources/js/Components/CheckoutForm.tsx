import { useState, FormEvent } from 'react';
import { useCart } from '@/contexts/CartContext';
import { router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faPhone, faMapPin, faCity, faLocationDot, faShieldAlt,
    faTrash, faShoppingCart
} from '@fortawesome/free-solid-svg-icons';

export default function CheckoutForm() {
    const { items, total, clearCart, removeFromCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        delivery_city: 'Yaoundé',
        delivery_neighborhood: '',
        delivery_landmark: '',
    });

    // Fonction pour gérer le chemin de l'image (locale ou externe)
    const getImageSrc = (src: string) => {
        if (!src) return '/images/placeholder.jpg';
        if (src.startsWith('http')) return src;
        return `/storage/${src}`;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            router.post('/checkout', {
                ...formData,
                total_amount: total,
                items: items.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
            });
            clearCart();
        } catch (error) {
            console.error('Erreur lors de la commande', error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">

            {/* --- ÉTAPE 1 : RÉCAPITULATIF DE LA COMMANDE --- */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-yann-cyan/10 flex items-center justify-center text-yann-cyan">
                        <FontAwesomeIcon icon={faShoppingCart} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Récapitulatif de votre commande</h3>
                        <p className="text-xs text-gray-500">Vérifiez vos articles avant de valider</p>
                    </div>
                </div>

                {items.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Votre panier est vide.</p>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                <img
                                    src={getImageSrc(item.product.primary_image)}
                                    alt={item.product.name}
                                    className="w-20 h-20 rounded-lg object-cover border border-gray-200 bg-gray-50"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{item.product.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {item.quantity} x {new Intl.NumberFormat('fr-FR').format(item.product.price)} FCFA
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="font-bold text-yann-cyan text-base">
                                        {new Intl.NumberFormat('fr-FR').format(item.product.price * item.quantity)} FCFA
                                    </span>
                                    <button
                                        onClick={() => removeFromCart(item.product.id)}
                                        className="text-gray-400 hover:text-red-500 text-xs transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="font-semibold text-gray-700 text-base">Total</span>
                            <span className="text-2xl font-bold text-yann-cyan">
                                {new Intl.NumberFormat('fr-FR').format(total)} FCFA
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* --- ÉTAPE 2 : FORMULAIRE DE LIVRAISON --- */}
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* --- SECTION 1 : Identité --- */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-yann-cyan/10 flex items-center justify-center text-yann-cyan">
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Vos informations personnelles</h3>
                            <p className="text-xs text-gray-500">Pour vous contacter concernant la livraison</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Nom complet</label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: Jean Dupont"
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yann-cyan/20 focus:border-yann-cyan outline-none transition-all text-sm"
                                value={formData.customer_name}
                                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Numéro de téléphone</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">+237</span>
                                <input
                                    type="tel"
                                    required
                                    placeholder="691 23 45 67"
                                    className="w-full pl-16 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yann-cyan/20 focus:border-yann-cyan outline-none transition-all text-sm"
                                    value={formData.customer_phone}
                                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2 : Adresse de livraison --- */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-yann-cyan/10 flex items-center justify-center text-yann-cyan">
                            <FontAwesomeIcon icon={faMapPin} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Adresse de livraison</h3>
                            <p className="text-xs text-gray-500">Où souhaitez-vous recevoir votre commande ?</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {/* Ville */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Ville</label>
                            <select
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yann-cyan/20 focus:border-yann-cyan outline-none transition-all text-sm cursor-pointer"
                                value={formData.delivery_city}
                                onChange={(e) => setFormData({ ...formData, delivery_city: e.target.value })}
                            >
                                <option value="Yaoundé">Yaoundé</option>
                                <option value="Douala">Douala</option>
                            </select>
                        </div>

                        {/* Quartier */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Quartier</label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: Bonapriso, Mvog-Mbi..."
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yann-cyan/20 focus:border-yann-cyan outline-none transition-all text-sm"
                                value={formData.delivery_neighborhood}
                                onChange={(e) => setFormData({ ...formData, delivery_neighborhood: e.target.value })}
                            />
                        </div>

                        {/* Point de repère */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                                Point de repère <span className="text-gray-400 font-normal lowercase">(optionnel)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: En face de la pharmacie, carrefour principal..."
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yann-cyan/20 focus:border-yann-cyan outline-none transition-all text-sm"
                                value={formData.delivery_landmark}
                                onChange={(e) => setFormData({ ...formData, delivery_landmark: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 3 : Total & Validation --- */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600">Total à payer</span>
                        <span className="text-2xl sm:text-3xl font-extrabold text-yann-cyan">
                            {new Intl.NumberFormat('fr-FR').format(total)} FCFA
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || items.length === 0}
                        className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-md flex items-center justify-center gap-3 ${
                            isSubmitting || items.length === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-yann-cyan text-white hover:bg-cyan-600 hover:shadow-lg hover:-translate-y-0.5'
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Validation en cours...
                            </>
                        ) : (
                            'Confirmer la commande'
                        )}
                    </button>

                    {items.length === 0 && (
                        <p className="text-sm text-red-500 text-center">Votre panier est vide.</p>
                    )}

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-1">
                        <FontAwesomeIcon icon={faShieldAlt} className="text-yann-cyan" />
                        <span>Paiement sécurisé à la livraison • Commandez en toute confiance</span>
                    </div>
                </div>
            </form>
        </div>
    );
}
