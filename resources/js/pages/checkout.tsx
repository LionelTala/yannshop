"use client"

import { useState, FormEvent } from 'react';
import { withPublicLayout } from '@/Layouts/PublicLayout';
import { router } from '@inertiajs/react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import {
    User, Phone, MapPin, Building2, LocateFixed,
    ShoppingBag, ShieldCheck, Truck, Clock
} from 'lucide-react';

Checkout.layout = withPublicLayout;

export default function Checkout() {
    const { items, total, clearCart } = useCart();
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        delivery_city: 'Yaoundé',
        delivery_neighborhood: '',
        delivery_landmark: '',
    });

    // Gestion des images locales
    const getImageSrc = (src: string) => {
        if (!src) return '/placeholder.svg';
        if (src.startsWith('http')) return src;
        return `/storage/${src}`;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            router.post('/checkout', {
                ...formData,
                total_amount: total,
                items: items.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
            });
            clearCart();
        } catch (error) {
            console.error('Erreur lors de la commande', error);
            showToast('Erreur lors de la commande. Veuillez réessayer.', 'error');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* --- COLONNE GAUCHE : Formulaire de commande --- */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="mb-4">
                        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                            Finaliser la commande
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Remplissez les informations ci-dessous pour recevoir vos produits.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* --- SECTION 1 : Identité --- */}
                        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                            <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                                    <User className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-card-foreground">Vos informations</h3>
                                    <p className="text-xs text-muted-foreground">Pour vous contacter concernant la livraison</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nom */}
                                <div className="space-y-2">
                                    <label htmlFor="customer_name" className="text-sm font-semibold text-card-foreground">
                                        Nom complet
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <User className="size-4" />
                                        </div>
                                        <input
                                            id="customer_name"
                                            type="text"
                                            required
                                            placeholder="Votre nom"
                                            className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
                                            value={formData.customer_name}
                                            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Téléphone */}
                                <div className="space-y-2">
                                    <label htmlFor="customer_phone" className="text-sm font-semibold text-card-foreground">
                                        Numéro de téléphone
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <Phone className="size-4" />
                                        </div>
                                        <input
                                            id="customer_phone"
                                            type="tel"
                                            required
                                            placeholder="Ex: 691 23 45 67"
                                            className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
                                            value={formData.customer_phone}
                                            onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* --- SECTION 2 : Localisation --- */}
                        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                            <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                                    <MapPin className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-card-foreground">Adresse de livraison</h3>
                                    <p className="text-xs text-muted-foreground">Où souhaitez-vous recevoir votre commande ?</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Ville */}
                                <div className="space-y-2">
                                    <label htmlFor="delivery_city" className="text-sm font-semibold text-card-foreground">
                                        Ville
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <Building2 className="size-4" />
                                        </div>
                                        <select
                                            id="delivery_city"
                                            className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
                                            value={formData.delivery_city}
                                            onChange={(e) => setFormData({ ...formData, delivery_city: e.target.value })}
                                        >
                                            <option value="Yaoundé">Yaoundé</option>
                                            <option value="Douala">Douala</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Quartier */}
                                <div className="space-y-2">
                                    <label htmlFor="delivery_neighborhood" className="text-sm font-semibold text-card-foreground">
                                        Quartier
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <LocateFixed className="size-4" />
                                        </div>
                                        <input
                                            id="delivery_neighborhood"
                                            type="text"
                                            required
                                            placeholder="Ex: Bonapriso, Mvog-Mbi..."
                                            className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
                                            value={formData.delivery_neighborhood}
                                            onChange={(e) => setFormData({ ...formData, delivery_neighborhood: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Point de repère */}
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="delivery_landmark" className="text-sm font-semibold text-card-foreground">
                                        Point de repère <span className="font-normal text-muted-foreground">(optionnel)</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <LocateFixed className="size-4" />
                                        </div>
                                        <input
                                            id="delivery_landmark"
                                            type="text"
                                            placeholder="Ex: À côté de la mosquée, en face du marché..."
                                            className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
                                            value={formData.delivery_landmark}
                                            onChange={(e) => setFormData({ ...formData, delivery_landmark: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* --- SECTION 3 : Total & Validation --- */}
                        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                                <span className="text-lg font-bold text-card-foreground">Total à payer</span>
                                <span className="text-3xl font-extrabold text-primary">
                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(total)} FCFA
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || items.length === 0}
                                className={`flex w-full items-center justify-center gap-3 rounded-full py-4 text-base font-semibold transition-all duration-300 shadow-sm ${
                                    isSubmitting || items.length === 0
                                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="size-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                        Traitement...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="size-5" />
                                        Confirmer la commande
                                    </>
                                )}
                            </button>

                            {items.length === 0 && (
                                <p className="mt-4 text-center text-sm text-destructive">Votre panier est vide.</p>
                            )}
                            <p className="mt-4 text-center text-xs text-muted-foreground">
                                En cliquant, vous acceptez nos conditions générales de vente.
                            </p>
                        </section>
                    </form>
                </div>

                {/* --- COLONNE DROITE : Récapitulatif du panier --- */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-card-foreground mb-6 flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-primary" />
                            Récapitulatif
                        </h3>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
                            {items.map((item) => (
                                <div key={item.product.id} className="flex items-center gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                                    <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                                        <img
                                            src={getImageSrc(item.product.primary_image)}
                                            alt={item.product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-card-foreground line-clamp-1">{item.product.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.quantity} x {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(item.product.price)}
                                        </p>
                                    </div>
                                    <span className="text-sm font-semibold text-primary">
                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(item.product.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-border pt-4 space-y-3 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Sous-total</span>
                                <span className="text-card-foreground">
                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(total)}
                                </span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Livraison</span>
                                <span className="font-medium text-green-600">Gratuite</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-3 border-t border-border mt-2">
                                <span className="text-card-foreground">Total</span>
                                <span className="text-primary">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(total)} FCFA</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
                            Livraison express Yaoundé & Douala
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
