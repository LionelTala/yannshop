import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome, faShoppingCart, faList, faClipboardList,
    faEnvelope, faBars, faTimes, faPhone
} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
 
const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/80 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* --- LOGO (Image réelle) --- */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <img
                            src="/logo.webp"
                            alt="YannShop Logo"
                            className="w-10 h-10 rounded-full object-cover border-2 border-yann-cyan shadow-md transition-transform group-hover:scale-105"
                        />
                        <span className="text-2xl font-bold tracking-tight text-yann-blue hidden sm:block">
                            Yann<span className="text-yann-cyan">Shop</span>
                        </span>
                    </Link>

                    {/* --- NAVIGATION DESKTOP AVEC ICÔNES --- */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-yann-cyan transition-colors duration-300 font-medium text-sm tracking-wide relative group">
                            <FontAwesomeIcon icon={faHome} className="text-sm" />
                            Accueil
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yann-cyan transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/shop" className="flex items-center gap-2 text-gray-600 hover:text-yann-cyan transition-colors duration-300 font-medium text-sm tracking-wide relative group">
                            <FontAwesomeIcon icon={faList} className="text-sm" />
                            Produits
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yann-cyan transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/orders" className="flex items-center gap-2 text-gray-600 hover:text-yann-cyan transition-colors duration-300 font-medium text-sm tracking-wide relative group">
                            <FontAwesomeIcon icon={faClipboardList} className="text-sm" />
                            Commandes
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yann-cyan transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/contact" className="flex items-center gap-2 text-gray-600 hover:text-yann-cyan transition-colors duration-300 font-medium text-sm tracking-wide relative group">
                            <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                            Contact
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yann-cyan transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>

                    {/* --- MENU MOBILE --- */}
                    <div className="flex items-center space-x-4 md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-yann-blue focus:outline-none">
                            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-2xl transition-transform duration-300" />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MENU MOBILE DÉPLIABLE AVEC ICÔNES --- */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-xl transition-all duration-500 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100 border-b border-gray-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col space-y-4 px-6 py-8">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-yann-blue font-medium text-lg hover:text-yann-cyan transition-colors">
                        <FontAwesomeIcon icon={faHome} className="w-5 text-yann-cyan" />
                        Accueil
                    </Link>
                    <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-yann-blue font-medium text-lg hover:text-yann-cyan transition-colors">
                        <FontAwesomeIcon icon={faList} className="w-5 text-yann-cyan" />
                        Produits
                    </Link>
                    <Link href="/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-yann-blue font-medium text-lg hover:text-yann-cyan transition-colors">
                        <FontAwesomeIcon icon={faClipboardList} className="w-5 text-yann-cyan" />
                        Commandes
                    </Link>
                    <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-yann-blue font-medium text-lg hover:text-yann-cyan transition-colors">
                        <FontAwesomeIcon icon={faEnvelope} className="w-5 text-yann-cyan" />
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    );
};

// --- FOOTER (avec liens sociaux dynamiques + crédit centré) ---
const Footer = () => {
    const { props } = usePage();
    const socials = (props as any).socials || {
        facebook: 'https://facebook.com/yannshop',
        tiktok: 'https://tiktok.com/@yannshop',
        whatsapp: 'https://wa.me/237659666110'
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
                                    <span>+237 691 234 567</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-yann-cyan w-4" />
                                    <span>contact@yannshop.cm</span>
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
        <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />

        </div>
    );
}
