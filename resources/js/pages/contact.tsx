import { Head } from '@inertiajs/react';
import { withPublicLayout } from '@/Layouts/PublicLayout';
import { Phone, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/Components/ContactForm";

interface ContactProps {
    phone: string;
    email: string;
    address: string;
}

ContactPage.layout = withPublicLayout;

export default function ContactPage({ phone, email, address }: ContactProps) {
    const siteUrl = 'https://yannshop.com'; // remplace par ton vrai domaine

    // Valeurs par défaut si Laravel n'envoie rien
    const resolvedPhone = phone || "+237 691 234 567";
    const resolvedEmail = email || "contact@yannshop.cm";
    const resolvedAddress = address || "Yaoundé & Douala, Cameroun";

    const infos = [
        { icon: MapPin, label: "Adresse", value: resolvedAddress },
        { icon: Phone, label: "Téléphone", value: resolvedPhone },
        { icon: Mail, label: "Email", value: resolvedEmail },
    ];

    const pageTitle = 'Contactez-nous - YannShop';
    const pageDescription = "Une question, une demande de livraison ? Contactez l'équipe YannShop à Yaoundé et Douala par téléphone, email ou notre formulaire.";

    // ContactPage + coordonnées : renforce la cohérence Nom/Adresse/Téléphone
    // (NAP) avec le schéma LocalBusiness de la page d'accueil — un signal
    // important pour le référencement local.
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: pageTitle,
        url: `${siteUrl}/contact`,
        mainEntity: {
            '@type': 'LocalBusiness',
            name: 'YannShop',
            telephone: resolvedPhone,
            email: resolvedEmail,
            address: {
                '@type': 'PostalAddress',
                addressLocality: resolvedAddress,
                addressCountry: 'CM',
            },
        },
    };

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={`${siteUrl}/contact`} />

                <meta property="og:type" content="website" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:url" content={`${siteUrl}/contact`} />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </Head>

            <header className="mb-8">
                <h1 className="text-balance text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                    Contactez-nous
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Une question, une demande ? Envoyez un message à notre équipe, nous vous répondrons rapidement.
                </p>
            </header>

            <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
                <aside className="space-y-4">
                    {infos.map((info) => (
                        <div key={info.label} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                                <info.icon className="size-5" />
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-card-foreground">{info.label}</p>
                                <p className="mt-0.5 text-sm text-muted-foreground">{info.value}</p>
                            </div>
                        </div>
                    ))}
                </aside>

                <ContactForm />
            </div>
        </div>
    );
}
