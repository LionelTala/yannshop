import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import FloatingCart from '@/Components/FloatingCart';
import axios from 'axios';
import { useToast } from '@/contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPhone, faEnvelope, faUser,
    faPaperPlane, faMapLocationDot, faClock
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

// Layout
Contact.layout = (page: React.ReactNode) => (
    <PublicLayout socials={{
        facebook: 'https://facebook.com/yannshop',
        instagram: 'https://instagram.com/yannshop',
        whatsapp: 'https://wa.me/237691234567'
    }}>
        {page}
    </PublicLayout>
);

interface ContactProps {
    contacts: {
        phone: string;
        whatsapp: string;
        email: string;
    };
}

const emptyForm = {
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
};

export default function Contact({ contacts }: ContactProps) {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    // Change à chaque soumission réussie pour forcer un remontage propre
    // du <form> plutôt qu'un diff DOM partiel — évite le conflit avec les
    // extensions navigateur (Grammarly, gestionnaires de mots de passe, etc.)
    // qui injectent des nœuds dans les inputs/textarea.
    const [formKey, setFormKey] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('/contact', formData);
            if (response.data.success) {
                showToast(response.data.message, 'success');
                setFormData(emptyForm);
                setFormKey((prev) => prev + 1);
            }
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Erreur lors de l\'envoi', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Nettoyage du numéro pour WhatsApp (enlever les espaces)
    const cleanPhone = contacts.whatsapp.replace(/\s/g, '');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            <div className="fixed bottom-10 right-8 z-50">
                <FloatingCart />
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-yann-blue">Contactez-nous</h1>
                <p className="text-gray-500 mt-2">
                    Une question, une suggestion, ou besoin d'aide ? N'hésitez pas à nous contacter.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- COLONNE DROITE : Informations de contact --- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">

                        {/* Téléphone / Appel */}
                        <div>
                            <h3 className="font-semibold text-yann-blue flex items-center gap-2 mb-2">
                                <FontAwesomeIcon icon={faPhone} className="text-yann-cyan" />
                                Appelez-nous
                            </h3>
                            <a
                                href={`tel:${contacts.phone}`}
                                className="text-gray-600 hover:text-yann-cyan transition-colors block text-lg"
                            >
                                {contacts.phone}
                            </a>
                        </div>

                        {/* WhatsApp (Appel vocal et texto) */}
                        <div>
                            <h3 className="font-semibold text-yann-blue flex items-center gap-2 mb-2">
                                <FontAwesomeIcon icon={faWhatsapp} className="text-green-500" />
                                WhatsApp
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={`https://wa.me/${cleanPhone}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faWhatsapp} /> Envoyer un message
                                </a>
                                <a
                                    href={`https://wa.me/${cleanPhone}?text=Bonjour%20YannShop%20!`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faPhone} /> Appel WhatsApp
                                </a>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                Disponible 24h/24 pour vos questions.
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <h3 className="font-semibold text-yann-blue flex items-center gap-2 mb-2">
                                <FontAwesomeIcon icon={faEnvelope} className="text-yann-cyan" />
                                Email
                            </h3>
                            <a
                                href={`mailto:${contacts.email}`}
                                className="text-gray-600 hover:text-yann-cyan transition-colors block text-lg"
                            >
                                {contacts.email}
                            </a>
                        </div>

                        {/* Localisation */}
                        <div>
                            <h3 className="font-semibold text-yann-blue flex items-center gap-2 mb-2">
                                <FontAwesomeIcon icon={faMapLocationDot} className="text-yann-cyan" />
                                Zone de livraison
                            </h3>
                            <p className="text-gray-600">
                                Livraison rapide à <span className="font-medium">Yaoundé</span> et <span className="font-medium">Douala</span>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- COLONNE GAUCHE : Formulaire de contact --- */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-yann-blue mb-6">Envoyez-nous un message</h2>

                        {/* La key change après chaque envoi réussi : React démonte et
                            remonte entièrement le formulaire au lieu de tenter un diff
                            partiel, ce qui évite le conflit avec les extensions qui ont
                            modifié le DOM des champs (cause de l'erreur insertBefore). */}
                        <form key={formKey} onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom complet
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <FontAwesomeIcon icon={faUser} className="text-sm" />
                                        </div>
                                        <input
                                            id="contact_name"
                                            type="text"
                                            required
                                            placeholder="Votre nom"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yann-cyan outline-none"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            data-gramm="false"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Téléphone
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <FontAwesomeIcon icon={faPhone} className="text-sm" />
                                        </div>
                                        <input
                                            id="contact_phone"
                                            type="tel"
                                            required
                                            placeholder="Ex: 691 23 45 67"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yann-cyan outline-none"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            data-gramm="false"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email (Optionnel)
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                                    </div>
                                    <input
                                        id="contact_email"
                                        type="email"
                                        placeholder="Ex: jean@example.com"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yann-cyan outline-none"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        data-gramm="false"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="contact_subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Sujet
                                </label>
                                <input
                                    id="contact_subject"
                                    type="text"
                                    required
                                    placeholder="Ex: Demande de livraison"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    data-gramm="false"
                                />
                            </div>

                            <div>
                                <label htmlFor="contact_message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="contact_message"
                                    required
                                    rows={5}
                                    placeholder="Décrivez votre demande..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yann-cyan outline-none resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    data-gramm="false"
                                    data-gramm_editor="false"
                                    data-enable-grammarly="false"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                                    isSubmitting
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-yann-cyan text-white hover:bg-cyan-600 hover:shadow-xl'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faPaperPlane} /> Envoyer le message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
