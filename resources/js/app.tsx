import './bootstrap';
import '../css/app.css';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { AdminProvider } from './contexts/AdminContext';



// --- CONFIGURATION FONT AWESOME ---
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faHome, faShoppingCart, faPhone, faEnvelope, faArrowLeft, faArrowRight,
    faTrash, faPlus, faMinus, faSearch, faCheck, faTruck, faUser, faSignOutAlt,
    faTimes, faStar, faHeart
} from '@fortawesome/free-solid-svg-icons';
// (Si tu veux plus d'icônes, tu peux en ajouter ici)

library.add(
    faHome, faShoppingCart, faPhone, faEnvelope, faArrowLeft, faArrowRight,
    faTrash, faPlus, faMinus, faSearch, faCheck, faTruck, faUser, faSignOutAlt,
    faTimes, faStar, faHeart
);
// --- FIN CONFIGURATION ---

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(
        `./pages/${name}.tsx`,
        import.meta.glob('./pages/**/*.tsx')
    ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ToastProvider>
            <CartProvider>
                <AdminProvider>
                        <App {...props} />
                </AdminProvider>

            </CartProvider>
            </ToastProvider>
    );
    },
    progress: {
        color: '#4B5563',
    },
});
