import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
 import { SiteHeader, MobileTabBar } from '@/components/PublicHeader';

// --- FOOTER (Ton footer existant, gardé intact) ---
const Footer = () => {
    const { props } = usePage();
    const socials = (props as any).socials || {
        facebook: 'https://facebook.com/yannshop',
        tiktok: 'https://tiktok.com/@yannshop',
        whatsapp: 'https://wa.me/237694375229'
    };
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-yann-blue text-white/80 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <img
                                src="/logo.webp"
                                alt="YannShop"
                                className="w-10 h-10 rounded-full object-cover border-2 border-yann-cyan"
                            />
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Yann<span className="text-yann-cyan">Shop</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            La boutique en ligne de confiance à Yaoundé et Douala.
                        </p>
                    </div>

                    {/* Liens Rapides */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/shop" className="hover:text-yann-cyan transition-colors">Tous les produits</Link></li>
                            <li><Link href="/orders" className="hover:text-yann-cyan transition-colors">Historique commandes</Link></li>
                            <li><Link href="/contact" className="hover:text-yann-cyan transition-colors">Contactez-nous</Link></li>
                        </ul>
                    </div>

                    {/* Informations */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Informations</h4>
                        <ul className="space-y-3 text-sm">
                            <li>Livraison à Yaoundé & Douala</li>
                            <li>Paiement à la livraison</li>
                            <li>Service client réactif</li>
                        </ul>
                    </div>

                    {/* Contact & Réseaux sociaux */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-white font-semibold mb-4">Contact</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center space-x-3">
                                    <FontAwesomeIcon icon={faPhone} className="text-yann-cyan w-4" />
                                    <span>+237 694 37 52 29</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-yann-cyan w-4" />
                                    <span>contact@yannshop.com</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Suivez-nous</h4>
                            <div className="flex space-x-4">
                                <a href={socials.facebook} target="_blank" rel="noopener noreferrer"
                                   className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yann-cyan transition-colors">
                                    <FontAwesomeIcon icon={faFacebookF} className="text-white" />
                                </a>
                                <a href={socials.tiktok} target="_blank" rel="noopener noreferrer"
                                   className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yann-cyan transition-colors">
                                    <FontAwesomeIcon icon={faTiktok} className="text-white" />
                                </a>
                                <a href={socials.whatsapp} target="_blank" rel="noopener noreferrer"
                                   className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yann-cyan transition-colors">
                                    <FontAwesomeIcon icon={faWhatsapp} className="text-white" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- COPYRIGHT & CRÉDIT (Centrés) --- */}
                <div className="border-t border-white/10 pt-8 flex flex-col items-center justify-center text-xs text-gray-500 gap-3">
                    <p>&copy; {currentYear} YannShop. Tous droits réservés.</p>
                    <div className="flex items-center gap-2">
                        <span>Développé par</span>
                        <a
                            href="https://wa.me/237659666110"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-white hover:text-yann-cyan transition-colors"
                        >
                            <FontAwesomeIcon icon={faWhatsapp} className="text-sm" />
                            <span className="font-medium">ShelbyDev</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// --- LE LAYOUT COMPLET ---
export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-dvh flex-col bg-background font-sans">
                 {/* Header Desktop / Mobile */}
                <SiteHeader />

                {/* Contenu principal */}
                <main className="flex-1 pb-20 md:pb-0">
                    {children}
                </main>

                {/* Ton Footer */}
                <Footer />

                {/* Barre de navigation mobile */}
                <MobileTabBar />
         </div>
    );
}

export const withPublicLayout = (page: React.ReactNode) => <PublicLayout>{page}</PublicLayout>;
