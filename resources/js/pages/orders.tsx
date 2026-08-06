import { useState, useMemo } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import FloatingCart from '@/Components/FloatingCart';
import axios from 'axios';
import { useToast } from '@/contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPhone, faEdit, faTrash, faCheckCircle, faClock,
    faTruck, faExclamationCircle, faSortAmountDown,
    faSortAmountUp, faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';

// Layout
orders.layout = (page: React.ReactNode) => (
    <PublicLayout socials={{
        facebook: 'https://facebook.com/yannshop',
        instagram: 'https://instagram.com/yannshop',
        whatsapp: 'https://wa.me/237691234567'
    }}>
        {page}
    </PublicLayout>
);

export default function orders() {
    const { showToast } = useToast();
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        delivery_city: '',
        delivery_neighborhood: '',
        delivery_landmark: '',
    });
    const [searchPerformed, setSearchPerformed] = useState(false);

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
            setCurrentPage(1); // Reset pagination

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

    // --- ÉDITION ---
    const startEdit = (order: any) => {
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

    // --- ANNULATION (Sécurisée) ---
    const cancelOrder = async (orderId: number) => {
        const order = orders.find(o => o.id === orderId);

        // Vérification de sécurité : on ne peut pas annuler une commande livrée
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

    // --- RENDU STATUT ---
    const getStatusBadge = (status: string) => {
        const classes = {
            'en_attente': 'bg-yellow-100 text-yellow-700',
            'en_cours': 'bg-blue-100 text-blue-700',
            'livré': 'bg-green-100 text-green-700',
            'annulé': 'bg-red-100 text-red-700',
        };
        const labels = {
            'en_attente': 'En attente',
            'en_cours': 'En cours',
            'livré': 'Livré',
            'annulé': 'Annulé',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-700'}`}>
                {labels[status as keyof typeof labels] || status}
            </span>
        );
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            <div className="fixed bottom-10 right-8 z-50">
                <FloatingCart />
            </div>

            <h1 className="text-3xl font-bold text-yann-blue mb-6">Mes Commandes</h1>

            {/* --- RECHERCHE --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <FontAwesomeIcon icon={faPhone} />
                        </div>
                        <input
                            type="tel"
                            placeholder="Entrez votre numéro (ex: 691234567)"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yann-cyan outline-none"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-8 py-3 bg-yann-cyan text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Chargement...' : 'Voir mes commandes'}
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </div>

            {/* --- RÉSULTATS --- */}
            {searchPerformed && (
                <>
                    {orders.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <FontAwesomeIcon icon={faExclamationCircle} className="text-4xl text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">Aucune commande trouvée pour ce numéro.</p>
                        </div>
                    ) : (
                        <>
                            {/* --- EN-TÊTE AVEC TRI --- */}
                            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                                <div className="text-sm text-gray-500">
                                    {sortedOrders.length} commande(s) trouvée(s)
                                </div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="text-xs text-gray-500">Trier par :</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-yann-cyan outline-none"
                                    >
                                        <option value="date">Date</option>
                                        <option value="amount">Montant</option>
                                        <option value="status">Statut</option>
                                    </select>
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={sortOrder === 'asc' ? faSortAmountUp : faSortAmountDown} />
                                    </button>
                                </div>
                            </div>

                            {/* --- LISTE DES COMMANDES --- */}
                            <div className="space-y-6">
                                {paginatedOrders.map((order) => (
                                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                                        {/* En-tête */}
                                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                                            <div>
                                                <span className="text-sm text-gray-500">Commande</span>
                                                <h3 className="font-bold text-yann-blue text-lg">#{order.invoice_number}</h3>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {getStatusBadge(order.status)}
                                                <span className="text-sm text-gray-400">
                                                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Corps */}
                                        <div className="p-6">
                                            {editingOrderId === order.id ? (
                                                // --- MODE ÉDITION ---
                                                <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                                                    <h4 className="font-semibold text-yann-blue">Modifier l'adresse</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-xs text-gray-500">Ville</label>
                                                            <select
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                                                value={editForm.delivery_city}
                                                                onChange={(e) => setEditForm({ ...editForm, delivery_city: e.target.value })}
                                                            >
                                                                <option value="Yaoundé">Yaoundé</option>
                                                                <option value="Douala">Douala</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-500">Quartier</label>
                                                            <input
                                                                type="text"
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                                                value={editForm.delivery_neighborhood}
                                                                onChange={(e) => setEditForm({ ...editForm, delivery_neighborhood: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500">Point de repère</label>
                                                        <input
                                                            type="text"
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                                            value={editForm.delivery_landmark}
                                                            onChange={(e) => setEditForm({ ...editForm, delivery_landmark: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="flex gap-3 mt-2">
                                                        <button onClick={() => saveEdit(order.id)} className="px-4 py-2 bg-yann-cyan text-white rounded-lg text-sm font-medium">Enregistrer</button>
                                                        <button onClick={cancelEdit} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">Annuler</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // --- MODE VISUALISATION ---
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-gray-500 block">Adresse</span>
                                                            <span className="font-medium">{order.delivery_city}, {order.delivery_neighborhood}</span>
                                                            {order.delivery_landmark && <span className="text-gray-500 block text-xs mt-1">({order.delivery_landmark})</span>}
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500 block">Total</span>
                                                            <span className="font-bold text-yann-cyan">
                                                                {new Intl.NumberFormat('fr-FR').format(order.total_amount)} FCFA
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Liste des produits */}
                                                    <div className="border-t border-gray-100 pt-4">
                                                        <p className="text-xs text-gray-500 mb-2">Produits commandés</p>
                                                        <div className="space-y-2">
                                                            {order.items?.map((item: any) => (
                                                                <div key={item.id} className="flex justify-between text-sm">
                                                                    <span>{item.product?.name} (x{item.quantity})</span>
                                                                    <span className="text-gray-600">
                                                                        {new Intl.NumberFormat('fr-FR').format(item.price * item.quantity)} FCFA
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* --- ACTIONS (SI MODIFIABLE ET NON LIVRÉE) --- */}
                                            {order.can_be_modified && order.status !== 'annulé' && order.status !== 'livré' && editingOrderId !== order.id && (
                                                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                                                    <button onClick={() => startEdit(order)} className="text-yann-cyan text-sm font-medium flex items-center gap-2 hover:underline">
                                                        <FontAwesomeIcon icon={faEdit} /> Modifier l'adresse
                                                    </button>
                                                    <button onClick={() => cancelOrder(order.id)} className="text-red-500 text-sm font-medium flex items-center gap-2 hover:underline">
                                                        <FontAwesomeIcon icon={faTrash} /> Annuler la commande
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* --- PAGINATION --- */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-8">
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faChevronLeft} />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`px-4 py-2 border border-gray-200 rounded-lg text-sm transition-colors ${
                                                currentPage === page
                                                ? 'bg-yann-cyan text-white border-yann-cyan'
                                                : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
