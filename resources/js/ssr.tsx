import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { AdminProvider } from './contexts/AdminContext';

// --- CONFIGURATION FONT AWESOME ---
// Nécessaire ici aussi : les icônes sont rendues pendant le SSR, donc la
// librairie doit être peuplée dans CE module également (pas seulement app.tsx),
// sinon les <FontAwesomeIcon> apparaîtront vides dans le HTML pré-rendu.
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faHome, faShoppingCart, faPhone, faEnvelope, faArrowLeft, faArrowRight,
    faTrash, faPlus, faMinus, faSearch, faCheck, faTruck, faUser, faSignOutAlt,
    faTimes, faStar, faHeart
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faHome, faShoppingCart, faPhone, faEnvelope, faArrowLeft, faArrowRight,
    faTrash, faPlus, faMinus, faSearch, faCheck, faTruck, faUser, faSignOutAlt,
    faTimes, faStar, faHeart
);
// --- FIN CONFIGURATION ---

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) =>
            resolvePageComponent(
                `./pages/${name}.tsx`,
                import.meta.glob('./pages/**/*.tsx')
            ),
        setup: ({ App, props }) => (
            <ToastProvider>
                <CartProvider>
                    <AdminProvider>
                        <App {...props} />
                    </AdminProvider>
                </CartProvider>
            </ToastProvider>
        ),
    })
);
