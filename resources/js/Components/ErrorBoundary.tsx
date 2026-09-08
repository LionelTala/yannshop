// resources/js/components/ErrorBoundary.tsx
import React from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

const RELOAD_FLAG_KEY = 'yannshop_dom_error_reload';

// Détecte les erreurs DOM connues causées par des extensions navigateur ou
// la traduction automatique (removeChild/insertBefore "not a child of this
// node"). Ces erreurs ne reflètent pas un bug de l'app : le DOM a été modifié
// en dehors du contrôle de React. On recharge automatiquement UNE SEULE fois
// (via sessionStorage) pour éviter une boucle infinie si l'erreur persiste
// pour une autre raison.
function isKnownBenignDomError(error: Error): boolean {
    const message = error.message || '';
    return (
        message.includes('removeChild') ||
        message.includes('insertBefore') ||
        message.includes('is not a child of this node')
    );
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        if (isKnownBenignDomError(error)) {
            const alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG_KEY);
            if (!alreadyReloaded) {
                sessionStorage.setItem(RELOAD_FLAG_KEY, '1');
                window.location.reload();
                return;
            }
        }
        // Erreur différente, ou déjà rechargé une fois sans succès :
        // on log pour investigation au lieu de boucler indéfiniment.
        console.error('Erreur applicative non récupérée :', error);
    }

    render() {
        if (this.state.hasError) {
            // Affiché brièvement pendant le rechargement automatique, ou si
            // l'erreur n'est pas de type DOM connu / a déjà été rechargée.
            return (
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
                    <p className="text-lg font-semibold text-gray-700">
                        Un instant, rechargement de la page...
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-full bg-yann-blue px-6 py-2.5 text-sm font-semibold text-white"
                    >
                        Recharger maintenant
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}