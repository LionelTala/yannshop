"use client"

import { useState } from "react"
import { Search, PackageSearch, Calendar } from "lucide-react"
import axios from 'axios';
import { useToast } from '@/contexts/ToastContext';

interface OrderItem {
    id: number;
    product: { name: string };
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    invoice_number: string;
    customer_name: string;
    customer_phone: string;
    status: string;
    created_at: string;
    total_amount: number;
    items: OrderItem[];
}

const statusStyles: Record<string, string> = {
    "en_attente": "bg-amber-100 text-amber-700",
    "en_cours": "bg-cyan-100 text-cyan-700",
    "livré": "bg-green-100 text-green-700",
    "annulé": "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
    "en_attente": "En attente",
    "en_cours": "En cours",
    "livré": "Livré",
    "annulé": "Annulé",
};

export function OrdersLookup() {
    const [phone, setPhone] = useState("")
    const [results, setResults] = useState<Order[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { showToast } = useToast();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const normalized = phone.replace(/\s+/g, "")
        if (!normalized) return;

        setIsLoading(true)
        try {
            const response = await axios.post('/orders/search', { phone: normalized })
            setResults(response.data.orders)
        } catch (error) {
            showToast('Erreur lors de la recherche. Veuillez réessayer.', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
            >
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-card-foreground">
                    Numéro de téléphone
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex : 691234567"
                        className="flex-1 rounded-full border border-input bg-background px-5 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
                    >
                        {isLoading ? (
                            <span className="size-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        ) : (
                            <Search className="size-4" />
                        )}
                        Rechercher
                    </button>
                </div>
            </form>

            {results !== null && (
                <div className="mt-8">
                    {results.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card py-14 text-center">
                            <PackageSearch className="size-10 text-muted-foreground" />
                            <p className="font-semibold text-card-foreground">Aucune commande trouvée</p>
                            <p className="max-w-sm text-sm text-muted-foreground">
                                Nous n&apos;avons trouvé aucune commande liée à ce numéro. Vérifiez-le et réessayez.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-primary">
                                {results.length} commande{results.length > 1 ? "s" : ""} trouvée{results.length > 1 ? "s" : ""}
                            </h2>
                            {results.map((order) => (
                                <article key={order.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="font-bold text-card-foreground">Commande #{order.invoice_number}</p>
                                            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Calendar className="size-3.5" />
                                                {new Date(order.created_at).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}
                                        >
                                            {statusLabels[order.status] || order.status}
                                        </span>
                                    </div>

                                    <ul className="mt-4 divide-y divide-border border-y border-border">
                                        {order.items.map((item, i) => (
                                            <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                                                <span className="text-card-foreground">{item.product?.name || 'Produit'}</span>
                                                <span className="text-muted-foreground">x{item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Total</span>
                                        <span className="text-lg font-extrabold text-primary">
                                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(order.total_amount)}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
