import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// --- CORRECTION ICI ---
// On définit le layout en utilisant la fonction 'CheckoutSuccess' (avec un C majuscule)
CheckoutSuccess.layout = (page: React.ReactNode) => (
    <PublicLayout socials={{
        facebook: 'https://facebook.com/yannshop',
        instagram: 'https://instagram.com/yannshop',
        whatsapp: 'https://wa.me/237691234567'
    }}>
        {page}
    </PublicLayout>
);

export default function CheckoutSuccess({ orderId }: { orderId: string }) {
    return (
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
            <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-yann-blue mb-4">Commande confirmée !</h1>
                <p className="text-gray-600 mb-2">Votre commande a été enregistrée avec succès.</p>
                <p className="text-sm text-gray-500 mb-8">
                    Numéro de commande : <span className="font-bold text-yann-cyan">{orderId}</span>
                </p>
                <p className="text-sm text-gray-500 mb-8">
                    Vous recevrez une confirmation par SMS. Nous vous contacterons pour confirmer la livraison.
                </p>
                <Link href="/" className="inline-block bg-yann-cyan text-white px-8 py-3 rounded-full font-semibold hover:bg-cyan-600 transition-colors">
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}
