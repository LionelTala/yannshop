import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faEye, faEyeSlash, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [locked, setLocked] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    // Décompte du blocage : un seul intervalle, correctement nettoyé,
    // qui déverrouille automatiquement le formulaire à zéro.
    useEffect(() => {
        if (timeLeft === null) return;

        if (timeLeft <= 0) {
            setLocked(false);
            setError('');
            setTimeLeft(null);
            return;
        }

        const id = setTimeout(() => {
            setTimeLeft((t) => (t !== null ? t - 1 : null));
        }, 1000);

        return () => clearTimeout(id);
    }, [timeLeft]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (locked) return;

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`/${import.meta.env.VITE_ADMIN_SECRET_PATH || 'yann-gestion'}`, {
                email,
                password,
            });

            if (response.data.success) {
                router.visit(response.data.redirect);
            }
        } catch (err: any) {
            if (err.response?.status === 429) {
                const seconds = err.response.data.retry_after || 300;
                setLocked(true);
                setTimeLeft(seconds);
                setError(`Trop de tentatives. Réessayez dans ${Math.ceil(seconds / 60)} minutes.`);
            } else {
                setError(err.response?.data?.message || 'Identifiants incorrects.');
            }
        } finally {
            setLoading(false);
        }
    };

    const minutes = timeLeft !== null ? Math.floor(timeLeft / 60) : 0;
    const seconds = timeLeft !== null ? timeLeft % 60 : 0;

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">
            <style>{`
                @keyframes yann-route-dash {
                    to { stroke-dashoffset: -24; }
                }
                @keyframes yann-pulse-ring {
                    0%, 100% { opacity: 0.35; transform: scale(1); }
                    50% { opacity: 0.9; transform: scale(1.15); }
                }
                .yann-route-line {
                    stroke-dasharray: 6 6;
                    animation: yann-route-dash 1.6s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .yann-route-line { animation: none; }
                    .yann-pulse { animation: none; }
                }
                .yann-pulse { animation: yann-pulse-ring 2.2s ease-in-out infinite; }
            `}</style>

            {/* --- PANNEAU GAUCHE : identité de marque (masqué en mobile) --- */}
            <div className="hidden lg:flex flex-col justify-between bg-yann-blue p-12 relative overflow-hidden">
                <div className="flex items-center gap-3">
                    <img
                        src="/logo.webp"
                        alt="YannShop"
                        className="w-11 h-11 rounded-full object-cover border-2 border-white/30"
                    />
                    <span className="text-white font-semibold tracking-wide">YannShop</span>
                </div>

                {/* Signature : deux points de livraison reliés par une route animée,
                    représentation directe de l'activité réelle (Yaoundé ⇄ Douala). */}
                <div className="flex-1 flex items-center justify-center">
                    <svg viewBox="0 0 320 140" className="w-full max-w-sm" aria-hidden="true">
                        <line x1="48" y1="100" x2="272" y2="40" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                        <line x1="48" y1="100" x2="272" y2="40" className="yann-route-line" stroke="#67E8F9" strokeWidth="2" />

                        <g className="yann-pulse" style={{ transformOrigin: '48px 100px' }}>
                            <circle cx="48" cy="100" r="7" fill="#67E8F9" />
                        </g>
                        <circle cx="48" cy="100" r="3" fill="#0B1F3A" />

                        <g className="yann-pulse" style={{ transformOrigin: '272px 40px', animationDelay: '1.1s' }}>
                            <circle cx="272" cy="40" r="7" fill="#67E8F9" />
                        </g>
                        <circle cx="272" cy="40" r="3" fill="#0B1F3A" />

                        <text x="30" y="122" fill="white" fontSize="13" fontWeight="600">Yaoundé</text>
                        <text x="240" y="24" fill="white" fontSize="13" fontWeight="600">Douala</text>
                    </svg>
                </div>

                <p className="text-white/70 text-sm max-w-xs leading-relaxed">
                    Deux villes, une seule interface. Pilotez vos commandes et livraisons YannShop depuis cet espace.
                </p>
            </div>

            {/* --- PANNEAU DROIT : formulaire --- */}
            <div className="flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-sm">

                    {/* En-tête compact, visible uniquement en mobile (le panneau gauche est masqué) */}
                    <div className="lg:hidden flex flex-col items-center text-center mb-8">
                        <img
                            src="/logo.webp"
                            alt="YannShop"
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm mb-3"
                        />
                        <span className="text-yann-blue font-semibold">YannShop</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-yann-blue">Espace gestion</h1>
                        <p className="text-gray-500 text-sm mt-1">Connectez-vous pour accéder au tableau de bord.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5" aria-describedby={error ? 'login-error' : undefined}>

                        <div>
                            <label htmlFor="admin_email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <FontAwesomeIcon icon={faUser} className="text-sm" />
                                </div>
                                <input
                                    id="admin_email"
                                    type="email"
                                    required
                                    autoComplete="username"
                                    disabled={locked}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yann-cyan focus:border-transparent transition-all outline-none disabled:opacity-50"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="admin_password" className="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <FontAwesomeIcon icon={faLock} className="text-sm" />
                                </div>
                                <input
                                    id="admin_password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    disabled={locked}
                                    className="w-full pl-10 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yann-cyan focus:border-transparent transition-all outline-none disabled:opacity-50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    disabled={locked}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yann-cyan transition-colors disabled:opacity-50"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-sm" />
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div
                                id="login-error"
                                role="alert"
                                className={`p-3.5 rounded-xl text-sm flex items-start gap-2.5 ${
                                    locked
                                        ? 'bg-amber-50 border border-amber-200 text-amber-800'
                                        : 'bg-red-50 border border-red-200 text-red-700'
                                }`}
                            >
                                {locked && <FontAwesomeIcon icon={faHourglassHalf} className="mt-0.5 text-amber-500" />}
                                <div>
                                    <p>{error}</p>
                                    {timeLeft !== null && timeLeft > 0 && (
                                        <p className="mt-1 font-mono font-semibold tabular-nums">
                                            {minutes}m {seconds.toString().padStart(2, '0')}s
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || locked}
                            className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                                loading || locked
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-yann-blue text-white hover:bg-yann-blue/90 shadow-lg shadow-yann-blue/20 hover:-translate-y-0.5'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Connexion...
                                </>
                            ) : locked ? (
                                <>
                                    <FontAwesomeIcon icon={faLock} className="text-sm" />
                                    Accès temporairement bloqué
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
