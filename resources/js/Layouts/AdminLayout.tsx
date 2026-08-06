import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome, faBox, faTruck, faEnvelope, faSignOutAlt,
    faBoxOpen, faTags, faBars, faTimes, faUserCog, faUserCircle,
    faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { useAdmin } from '@/contexts/AdminContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { badges } = useAdmin();
    const { url, props } = usePage();
    const secretPath = import.meta.env.VITE_ADMIN_SECRET_PATH || 'yann-gestion';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const user = props.auth?.user as { name?: string } | undefined;
    const adminName = user?.name || 'Admin';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Verrouille le scroll de la page derrière la sidebar quand elle est ouverte sur mobile,
    // et permet de la fermer avec la touche Échap.
    useEffect(() => {
        if (!isSidebarOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsSidebarOpen(false);
        };
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isSidebarOpen]);

    // Ferme automatiquement la sidebar si l'écran passe en desktop pendant qu'elle est ouverte
    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (e.matches) setIsSidebarOpen(false);
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const isActive = (path: string) => {
        return url === path || url.startsWith(path + '/');
    };

    const navLinks = [
        { href: `/${secretPath}/dashboard`, icon: faHome, label: 'Dashboard' },
        { href: `/${secretPath}/orders`, icon: faBox, label: 'Commandes', badge: badges.orders },
        { href: `/${secretPath}/products`, icon: faBoxOpen, label: 'Produits' },
        { href: `/${secretPath}/categories`, icon: faTags, label: 'Catégories' },
        { href: `/${secretPath}/deliverers`, icon: faTruck, label: 'Livreurs' },
        { href: `/${secretPath}/messages`, icon: faEnvelope, label: 'Messages', badge: badges.messages },
        { href: `/${secretPath}/profile`, icon: faUserCog, label: 'Mon Profil' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* --- TOPBAR --- */}
            <header className="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Ouvrir le menu"
                        aria-expanded={isSidebarOpen}
                        className="md:hidden text-yann-blue text-xl p-1"
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <div className="flex items-center gap-2">
                        <img src="/logo.webp" alt="YannShop" className="w-8 h-8 rounded-full object-cover" />
                        <span className="font-bold text-yann-blue text-lg hidden sm:block">
                            Yann<span className="text-yann-cyan">Shop</span>
                        </span>
                    </div>
                </div>
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                    >
                        <FontAwesomeIcon icon={faUserCircle} className="text-xl text-yann-cyan" />
                        <span className="hidden sm:inline">{adminName}</span>
                        <FontAwesomeIcon icon={faChevronDown} className="text-xs text-gray-400" />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-1 z-50">
                            <Link
                                href={`/${secretPath}/profile`}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <FontAwesomeIcon icon={faUserCog} className="w-4 text-yann-cyan" />
                                Mon Profil
                            </Link>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
                                Déconnexion
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* --- CONTENEUR PRINCIPAL AVEC SCROLL INDÉPENDANT --- */}
            <div className="flex flex-1 pt-16 h-screen overflow-hidden">

                {/* --- OVERLAY MOBILE --- */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 top-16 z-30 bg-black/30 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-hidden="true"
                    />
                )}

                {/* --- SIDEBAR --- */}
                <aside className={`
                    fixed top-16 left-0 right-0 bottom-0 z-40 bg-white transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 md:static md:w-64 md:border-r md:border-gray-200
                    md:flex md:flex-col md:h-full md:overflow-y-auto
                `}>

                    {/* --- BOUTON FERMER (mobile) --- */}
                    <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                        <span className="font-bold text-yann-blue">Menu</span>
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(false)}
                            aria-label="Fermer le menu"
                            className="text-gray-600 hover:text-red-500 text-xl p-2 -mr-2 transition-colors"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`
                                    flex items-center justify-between px-4 py-3 rounded-xl transition-colors
                                    ${isActive(link.href)
                                        ? 'bg-yann-cyan/10 text-yann-cyan font-medium'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-yann-cyan'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={link.icon} className="w-5" />
                                    <span className="font-medium">{link.label}</span>
                                </div>
                                {link.badge > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Déconnexion */}
                    <div className="p-4 border-t border-gray-100 mt-auto">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
                            <span className="font-medium">Déconnexion</span>
                        </Link>
                    </div>
                </aside>

                {/* --- MAIN CONTENT (Scroll uniquement ici) --- */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50 h-full">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
