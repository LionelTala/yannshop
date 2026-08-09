"use client"

import { withPublicLayout } from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

CheckoutSuccess.layout = withPublicLayout;

export default function CheckoutSuccess({ orderId }: { orderId: string }) {
    return (
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
            <div className="rounded-3xl border border-border bg-card p-12 shadow-sm">
                <div className="flex size-20 items-center justify-center rounded-full bg-green-100 mx-auto mb-6">
                    <CheckCircle2 className="size-10 text-green-600" />
                </div>

                <h1 className="text-balance text-3xl font-extrabold tracking-tight text-primary sm:text-4xl mb-4">
                    Commande confirmée !
                </h1>
                <p className="text-muted-foreground mb-2">
                    Votre commande a été enregistrée avec succès.
                </p>
                <p className="text-sm text-muted-foreground mb-8">
                    Numéro de commande :{' '}
                    <span className="font-bold text-primary">{orderId}</span>
                </p>
                <p className="text-sm text-muted-foreground mb-8">
                    Vous recevrez une confirmation par SMS. Nous vous contacterons pour confirmer la livraison.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}
