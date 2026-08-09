"use client"

import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import {
    Lock, User, Eye, EyeOff, Hourglass,
    MapPin, ShoppingBag, ShieldCheck
} from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [locked, setLocked] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    // Décompte du blocage
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
        <div className="min-h-screen grid lg:grid-cols-2 bg-background">
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

            {/* --- PANNEAU GAUCHE : identité de marque --- */}
            <div className="hidden lg:flex flex-col justify-between bg-primary p-12 relative overflow-hidden">
                <div className="flex items-center gap-3">
                    <img
                        src="/logo.webp"
                        alt="YannShop"
                        className="w-11 h-11 rounded-full object-cover border-2 border-primary-foreground/30"
                    />
                    <span className="text-primary-foreground font-semibold tracking-wide">YannShop</span>
                </div>

                {/* SVG animé */}
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

                <p className="text-primary-foreground/70 text-sm max-w-xs leading-relaxed">
                    Deux villes, une seule interface. Pilotez vos commandes et livraisons YannShop depuis cet espace.
                </p>
            </div>

            {/* --- PANNEAU DROIT : formulaire --- */}
            <div className="flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-sm">

                    {/* En-tête mobile */}
                    <div className="lg:hidden flex flex-col items-center text-center mb-8">
                        <img
                            src="/logo.webp"
                            alt="YannShop"
                            className="w-16 h-16 rounded-full object-cover border-2 border-border shadow-sm mb-3"
                        />
                        <span className="text-primary font-semibold">YannShop</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-primary">Espace gestion</h1>
                        <p className="text-muted-foreground text-sm mt-1">Connectez-vous pour accéder au tableau de bord.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-2">
                            <label htmlFor="admin_email" className="text-sm font-medium text-foreground">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <User className="size-4" />
                                </div>
                                <input
                                    id="admin_email"
                                    type="email"
                                    required
                                    autoComplete="username"
                                    disabled={locked}
                                    className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="admin_password" className="text-sm font-medium text-foreground">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Lock className="size-4" />
                                </div>
                                <input
                                    id="admin_password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    disabled={locked}
                                    className="w-full rounded-xl border border-input bg-background pl-10 pr-11 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    disabled={locked}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors disabled:opacity-50"
                                >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div
                                id="login-error"
                                role="alert"
                                className={`p-3.5 rounded-xl text-sm flex items-start gap-2.5 ${
                                    locked
                                        ? 'bg-amber-50/50 border border-amber-200 text-amber-800'
                                        : 'bg-destructive/10 border border-destructive/20 text-destructive'
                                }`}
                            >
                                {locked && <Hourglass className="mt-0.5 size-4 text-amber-500" />}
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
                                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:-translate-y-0.5'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                    Connexion...
                                </>
                            ) : locked ? (
                                <>
                                    <Lock className="size-4" />
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
