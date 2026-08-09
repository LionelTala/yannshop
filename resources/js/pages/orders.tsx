"use client"

import { useState, useMemo } from 'react';
import { withPublicLayout } from '@/Layouts/PublicLayout';
import axios from 'axios';
import { useToast } from '@/contexts/ToastContext';
import { Search, PackageSearch, Calendar, Pencil, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

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
    delivery_city: string;
    delivery_neighborhood: string;
    delivery_landmark: string | null;
    can_be_modified: boolean;
    items: OrderItem[];
}

// Layout
orders.layout =  withPublicLayout;


export default function orders() {
    const { showToast } = useToast();
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        delivery_city: '',
        delivery_neighborhood: '',
        delivery_landmark: '',
    });

    // --- TRI & PAGINATION ---
    const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // --- RECHERCHE ---
    const handleSearch = async () => {
        if (!phone) return;
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/orders/search', { phone });
            setOrders(response.data.orders);
            setSearchPerformed(true);
            setCurrentPage(1);

            if (response.data.orders.length === 0) {
                showToast('Aucune commande trouvée pour ce numéro.', 'info');
            }
        } catch (err) {
            setError('Erreur lors de la recherche. Vérifie ton numéro.');
            showToast('Erreur lors de la recherche. Vérifie ton numéro.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // --- COMMANDES TRIÉES ---
    const sortedOrders = useMemo(() => {
        const sorted = [...orders];
        if (sortBy === 'date') {
            sorted.sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });
        } else if (sortBy === 'amount') {
            sorted.sort((a, b) => {
                return sortOrder === 'asc'
                    ? a.total_amount - b.total_amount
                    : b.total_amount - a.total_amount;
            });
        } else if (sortBy === 'status') {
            sorted.sort((a, b) => {
                const statusOrder = ['en_attente', 'en_cours', 'livré', 'annulé'];
                const indexA = statusOrder.indexOf(a.status);
                const indexB = statusOrder.indexOf(b.status);
                return sortOrder === 'asc' ? indexA - indexB : indexB - indexA;
            });
        }
        return sorted;
    }, [orders, sortBy, sortOrder]);

    // --- PAGINATION ---
    const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
    const paginatedOrders = sortedOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // --- STATUT & BADGES ---
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

    // --- ÉDITION ---
    const startEdit = (order: Order) => {
        setEditingOrderId(order.id);
        setEditForm({
            delivery_city: order.delivery_city,
            delivery_neighborhood: order.delivery_neighborhood,
            delivery_landmark: order.delivery_landmark || '',
        });
    };

    const cancelEdit = () => {
        setEditingOrderId(null);
    };

    const saveEdit = async (orderId: number) => {
        try {
            const response = await axios.put(`/orders/${orderId}`, editForm);
            setOrders(prev => prev.map(o => o.id === orderId ? response.data.order : o));
            setEditingOrderId(null);
            showToast('Adresse modifiée avec succès !', 'success');
        } catch (err: any) {
            showToast(err.response?.data?.error || 'Erreur lors de la modification', 'error');
        }
    };

    // --- ANNULATION ---
    const cancelOrder = async (orderId: number) => {
        const order = orders.find(o => o.id === orderId);
        if (order?.status === 'livré') {
            showToast('Impossible d\'annuler une commande déjà livrée.', 'error');
            return;
        }
        if (!confirm('Es-tu sûr de vouloir annuler cette commande ?')) return;
        try {
            await axios.delete(`/orders/${orderId}`);
            setOrders(prev => prev.map(o =>
                o.id === orderId ? { ...o, status: 'annulé', can_be_modified: false } : o
            ));
            showToast('Commande annulée avec succès.', 'success');
        } catch (err: any) {
            showToast(err.response?.data?.error || 'Erreur lors de l\'annulation', 'error');
        }
    };

    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <header className="mb-8">
                <h1 className="text-balance text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                    Suivi de commandes
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Entrez votre numéro de téléphone pour retrouver vos commandes et leur statut.
                </p>
            </header>

            {/* --- RECHERCHE --- */}
            <form
                onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
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
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="size-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        ) : (
                            <Search className="size-4" />
                        )}
                        Rechercher
                    </button>
                </div>
                {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            </form>

            {/* --- RÉSULTATS --- */}
            {searchPerformed && (
                <div key={phone + sortedOrders.length} className="mt-8"> {/* <-- CLÉ AJOUTÉE */}
                    {orders.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card py-14 text-center">
                            <PackageSearch className="size-10 text-muted-foreground" />
                            <p className="font-semibold text-card-foreground">Aucune commande trouvée</p>
                            <p className="max-w-sm text-sm text-muted-foreground">
                                Nous n&apos;avons trouvé aucune commande liée à ce numéro. Vérifiez-le et réessayez.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* --- EN-TÊTE AVEC TRI --- */}
                            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                                <div className="text-sm text-muted-foreground">
                                    {sortedOrders.length} commande(s) trouvée(s)
                                </div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="text-xs text-muted-foreground">Trier par :</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
                                    >
                                        <option value="date">Date</option>
                                        <option value="amount">Montant</option>
                                        <option value="status">Statut</option>
                                    </select>
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className="rounded-full border border-input bg-background p-2 text-sm hover:bg-secondary transition-colors"
                                    >
                                        <ArrowUpDown className="size-4" />
                                    </button>
                                </div>
                            </div>

                            {/* --- LISTE DES COMMANDES --- */}
                            <div className="space-y-4">
                                {paginatedOrders.map((order) => (
                                    <article key={order.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                        {/* En-tête */}
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

                                        {/* Corps (Adresse + Produits) */}
                                        <div className="mt-4 space-y-3">
                                            {/* Adresse */}
                                            <div className="text-sm text-muted-foreground border-b border-border pb-3">
                                                <p className="font-medium text-card-foreground">Adresse de livraison</p>
                                                <p>{order.delivery_city}, {order.delivery_neighborhood}</p>
                                                {order.delivery_landmark && <p className="text-xs">({order.delivery_landmark})</p>}
                                            </div>

                                            {/* Liste des produits */}
                                            <ul className="divide-y divide-border">
                                                {order.items.map((item, i) => (
                                                    <li key={i} className="flex items-center justify-between py-2 text-sm">
                                                        <span className="text-card-foreground">{item.product?.name || 'Produit'}</span>
                                                        <span className="text-muted-foreground">x{item.quantity}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Total */}
                                            <div className="flex items-center justify-between pt-2 border-t border-border">
                                                <span className="text-sm text-muted-foreground">Total</span>
                                                <span className="text-lg font-extrabold text-primary">
                                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(order.total_amount)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* --- ACTIONS (SI MODIFIABLE ET NON LIVRÉE) --- */}
                                        {order.can_be_modified && order.status !== 'annulé' && order.status !== 'livré' && editingOrderId !== order.id && (
                                            <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
                                                <button
                                                    onClick={() => startEdit(order)}
                                                    className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                                                >
                                                    <Pencil className="size-3.5" />
                                                    Modifier l'adresse
                                                </button>
                                                <button
                                                    onClick={() => cancelOrder(order.id)}
                                                    className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                    Annuler la commande
                                                </button>
                                            </div>
                                        )}

                                        {/* --- MODE ÉDITION (si en cours) --- */}
                                        {editingOrderId === order.id && (
                                            <div className="mt-4 pt-4 border-t border-border space-y-4">
                                                <h4 className="font-semibold text-card-foreground text-sm">Modifier l'adresse</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Ville</label>
                                                        <select
                                                            value={editForm.delivery_city}
                                                            onChange={(e) => setEditForm({ ...editForm, delivery_city: e.target.value })}
                                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                                                        >
                                                            <option value="Yaoundé">Yaoundé</option>
                                                            <option value="Douala">Douala</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Quartier</label>
                                                        <input
                                                            type="text"
                                                            value={editForm.delivery_neighborhood}
                                                            onChange={(e) => setEditForm({ ...editForm, delivery_neighborhood: e.target.value })}
                                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Point de repère</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.delivery_landmark}
                                                        onChange={(e) => setEditForm({ ...editForm, delivery_landmark: e.target.value })}
                                                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                                                    />
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => saveEdit(order.id)}
                                                        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                                                    >
                                                        Enregistrer
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="rounded-full border border-input bg-background px-4 py-2 text-sm font-semibold hover:bg-secondary transition-colors"
                                                    >
                                                        Annuler
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>

                            {/* --- PAGINATION --- */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="flex size-10 items-center justify-center rounded-full border border-input bg-background text-sm transition-colors hover:bg-secondary disabled:opacity-50"
                                    >
                                        <ChevronLeft className="size-4" />
                                    </button>
                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                                                    currentPage === page
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-secondary text-muted-foreground hover:text-primary'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="flex size-10 items-center justify-center rounded-full border border-input bg-background text-sm transition-colors hover:bg-secondary disabled:opacity-50"
                                    >
                                        <ChevronRight className="size-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
