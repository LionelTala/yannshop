import { useState, FormEvent } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import FloatingCart from '@/Components/FloatingCart';
import { useCart } from '@/contexts/CartContext';
import { router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faMapPin, faCity, faLocationDot } from '@fortawesome/free-solid-svg-icons';

Checkout.layout = (page: React.ReactNode) => (
    <PublicLayout socials={{
        facebook: 'https://facebook.com/yannshop',
        instagram: 'https://instagram.com/yannshop',
        whatsapp: 'https://wa.me/237691234567'
    }}>
        {page}
    </PublicLayout>
);

export default function Checkout() {
    const { items, total, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        delivery_city: 'Yaoundé',
        delivery_neighborhood: '',
        delivery_landmark: '',
    });

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* Panier flottant */}
            <div className="fixed bottom-10 right-8 z-50">
                <FloatingCart />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 max-w-6xl mx-auto">

                {/* --- COLONNE GAUCHE : Formulaire de commande --- */}
                <div className="lg:col-span-2">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-yann-blue">Finaliser la commande</h1>
                        <p className="text-gray-500 mt-2">Remplissez les informations ci-dessous pour recevoir vos produits.</p>
                    </div>

                    {/* Le formulaire occupe désormais toute la largeur de la colonne,
                        aligné avec le titre au-dessus (plus de max-w-2xl mx-auto). */}
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* --- SECTION 1 : Identité --- */}
                        <div>
                            <h3 className="text-xl font-bold text-yann-blue mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-yann-cyan rounded-full"></span>
                                Vos informations
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Champ Nom */}
                                <div className="relative group">
                                    <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom complet
                                    </label>
                                    <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-yann-cyan focus-within:border-transparent transition-all duration-300 overflow-hidden">
                                        <div className="pl-4 text-gray-400 group-focus-within:text-yann-cyan transition-colors">
                                            <FontAwesomeIcon icon={faUser} className="text-sm" />
                                        </div>
                                        <input
                                            id="customer_name"
                                            type="text"
                                            required
                                            placeholder="Votre nom"
                                            className="flex-1 w-full py-3.5 px-3 bg-transparent outline-none placeholder:text-gray-400"
                                            value={formData.customer_name}
                                            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Champ Téléphone */}
                                <div className="relative group">
                                    <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Numéro de téléphone
                                    </label>
                                    <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-yann-cyan focus-within:border-transparent transition-all duration-300 overflow-hidden">
                                        <div className="pl-4 text-gray-400 group-focus-within:text-yann-cyan transition-colors">
                                            <FontAwesomeIcon icon={faPhone} className="text-sm" />
                                        </div>
                                        <input
                                            id="customer_phone"
                                            type="tel"
                                            required
                                            placeholder="Ex: 691 23 45 67"
                                            className="flex-1 w-full py-3.5 px-3 bg-transparent outline-none placeholder:text-gray-400"
                                            value={formData.customer_phone}
                                            onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- SECTION 2 : Localisation --- */}
                        <div>
                            <h3 className="text-xl font-bold text-yann-blue mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-yann-cyan rounded-full"></span>
                                Adresse de livraison
                            </h3>

                            {/* Même structure en grille que la section précédente,
                                pour garder un rythme visuel cohérent. */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Champ Ville */}
                                <div className="relative group">
                                    <label htmlFor="delivery_city" className="block text-sm font-medium text-gray-700 mb-2">
                                        Ville
                                    </label>
                                    <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-yann-cyan focus-within:border-transparent transition-all duration-300 overflow-hidden">
                                        <div className="pl-4 text-gray-400 group-focus-within:text-yann-cyan transition-colors">
                                            <FontAwesomeIcon icon={faCity} className="text-sm" />
                                        </div>
                                        <select
                                            id="delivery_city"
                                            className="flex-1 w-full py-3.5 px-3 bg-transparent outline-none appearance-none cursor-pointer"
                                            value={formData.delivery_city}
                                            onChange={(e) => setFormData({ ...formData, delivery_city: e.target.value })}
                                        >
                                            <option value="Yaoundé">Yaoundé</option>
                                            <option value="Douala">Douala</option>
                                        </select>
                                        <div className="pr-4 text-gray-400 pointer-events-none">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Champ Quartier */}
                                <div className="relative group">
                                    <label htmlFor="delivery_neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                                        Quartier
                                    </label>
                                    <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-yann-cyan focus-within:border-transparent transition-all duration-300 overflow-hidden">
                                        <div className="pl-4 text-gray-400 group-focus-within:text-yann-cyan transition-colors">
                                            <FontAwesomeIcon icon={faMapPin} className="text-sm" />
                                        </div>
                                        <input
                                            id="delivery_neighborhood"
                                            type="text"
                                            required
                                            placeholder="Ex: Bonapriso, Mvog-Mbi..."
                                            className="flex-1 w-full py-3.5 px-3 bg-transparent outline-none placeholder:text-gray-400"
                                            value={formData.delivery_neighborhood}
                                            onChange={(e) => setFormData({ ...formData, delivery_neighborhood: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Champ Point de repère : pleine largeur, seul champ optionnel du bloc */}
                                <div className="relative group md:col-span-2">
                                    <label htmlFor="delivery_landmark" className="block text-sm font-medium text-gray-700 mb-2">
                                        Point de repère <span className="text-gray-400 font-normal">(optionnel)</span>
                                    </label>
                                    <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-yann-cyan focus-within:border-transparent transition-all duration-300 overflow-hidden">
                                        <div className="pl-4 text-gray-400 group-focus-within:text-yann-cyan transition-colors">
                                            <FontAwesomeIcon icon={faLocationDot} className="text-sm" />
                                        </div>
                                        <input
                                            id="delivery_landmark"
                                            type="text"
                                            placeholder="Ex: À côté de la mosquée, en face du marché..."
                                            className="flex-1 w-full py-3.5 px-3 bg-transparent outline-none placeholder:text-gray-400"
                                            value={formData.delivery_landmark}
                                            onChange={(e) => setFormData({ ...formData, delivery_landmark: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- SECTION 3 : Total & Validation --- */}
                        <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-semibold text-gray-700 text-lg">Total à payer</span>
                                <span className="text-3xl font-bold text-yann-cyan">
                                    {new Intl.NumberFormat('fr-FR').format(total)} FCFA
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || items.length === 0}
                                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-3 ${
                                    isSubmitting || items.length === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-yann-cyan text-white hover:bg-cyan-600 hover:shadow-xl hover:-translate-y-0.5'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Traitement...
                                    </>
                                ) : (
                                    'Confirmer la commande'
                                )}
                            </button>

                            {items.length === 0 && (
                                <p className="text-sm text-red-500 text-center mt-3">Votre panier est vide.</p>
                            )}
                            <p className="text-xs text-gray-400 text-center mt-3">
                                En cliquant, vous acceptez nos conditions générales de vente.
                            </p>
                        </div>
                    </form>
                </div>

                {/* --- COLONNE DROITE : Récapitulatif du panier --- */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 sticky top-24">
                        <h3 className="text-xl font-bold text-yann-blue mb-6 flex items-center gap-2">
                            <span className="w-1 h-5 bg-yann-cyan rounded-full"></span>
                            Récapitulatif
                        </h3>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
                            {items.map((item) => (
                                <div key={item.product.id} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                    <img src={item.product.primary_image} alt={item.product.name} className="w-14 h-14 object-cover rounded-lg bg-gray-100" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-yann-blue line-clamp-1">{item.product.name}</p>
                                        <p className="text-xs text-gray-500">{item.quantity} x {new Intl.NumberFormat('fr-FR').format(item.product.price)} FCFA</p>
                                    </div>
                                    <span className="text-sm font-semibold text-yann-cyan">
                                        {new Intl.NumberFormat('fr-FR').format(item.product.price * item.quantity)} FCFA
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Sous-total</span>
                                <span>{new Intl.NumberFormat('fr-FR').format(total)} FCFA</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Livraison</span>
                                <span className="text-green-600 font-medium">Gratuite</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-100 mt-2">
                                <span className="text-yann-blue">Total</span>
                                <span className="text-yann-cyan">{new Intl.NumberFormat('fr-FR').format(total)} FCFA</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
                            Livraison express Yaoundé & Douala
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
