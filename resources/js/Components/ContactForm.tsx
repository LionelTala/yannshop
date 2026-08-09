"use client"

import { useState } from "react"
import { Send, CheckCircle2 } from "lucide-react"
import axios from 'axios';
import { useToast } from '@/contexts/ToastContext';

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"

export function ContactForm() {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            // On envoie les données à Laravel
            await axios.post('/contact', data);

            setSent(true);
            e.currentTarget.reset();
            showToast('Message envoyé avec succès !', 'success');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erreur lors de l\'envoi. Veuillez réessayer.';
            showToast(message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (sent) {
        return (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card py-16 text-center shadow-sm">
                <CheckCircle2 className="size-12 text-accent" />
                <h2 className="text-xl font-bold text-card-foreground">Message envoyé !</h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                    Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
                </p>
                <button
                    onClick={() => setSent(false)}
                    className="rounded-full border border-input bg-background px-6 py-2 text-sm font-semibold hover:bg-secondary transition-colors"
                >
                    Envoyer un autre message
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-card-foreground">
                        Nom complet
                    </label>
                    <input id="name" name="name" type="text" required placeholder="Votre nom" className={fieldClass} />
                </div>
                <div>
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-card-foreground">
                        Numéro de téléphone
                    </label>
                    <input id="phone" name="phone" type="tel" required placeholder="Ex: 691234567" className={fieldClass} />
                </div>
            </div>

            <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-card-foreground">
                    Email <span className="font-normal text-muted-foreground">(facultatif)</span>
                </label>
                <input id="email" name="email" type="email" placeholder="vous@exemple.com" className={fieldClass} />
            </div>

            <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold text-card-foreground">
                    Sujet
                </label>
                <input id="subject" name="subject" type="text" required placeholder="Objet de votre message" className={fieldClass} />
            </div>

            <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-card-foreground">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Écrivez votre message ici..."
                    className={`${fieldClass} resize-none`}
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 sm:w-auto sm:px-8"
            >
                {isSubmitting ? (
                    <>
                        <span className="size-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Envoi...
                    </>
                ) : (
                    <>
                        <Send className="size-4" />
                        Envoyer le message
                    </>
                )}
            </button>
        </form>
    )
}
