import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useToast } from '@/contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faCheckCircle, faClock, faUserCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

interface Deliverer {
    id: number;
    name: string;
    phone: string;
    city: string;
}

interface Order {
    id: number;
    invoice_number: string;
    customer_name: string;
    customer_phone: string;
    delivery_city: string;
    delivery_neighborhood: string;
    delivery_landmark: string | null;
    total_amount: number;
    status: string;
    deliverer: Deliverer | null;
    items: { product: { name: string }; quantity: number }[];
}

interface OrdersProps {
    orders: Order[];
    deliverers: Deliverer[];
}

Orders.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default function Orders({ orders, deliverers }: OrdersProps) {
    const { showToast } = useToast();
    const secretPath = import.meta.env.VITE_ADMIN_SECRET_PATH || 'yann-gestion';
    const [filter, setFilter] = useState<'all' | 'pending' | 'delivering' | 'delivered'>('all');
    const [assigningOrderId, setAssigningOrderId] = useState<number | null>(null);
    const [selectedDelivererId, setSelectedDelivererId] = useState<string>('');

    // --- FILTRAGE ---
    const filteredOrders = orders?.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'pending') return order.status === 'en_attente';
        if (filter === 'delivering') return order.status === 'en_cours';
        if (filter === 'delivered') return order.status === 'livré';
        return true;
    }) || [];

    // --- ASSIGNER UN LIVREUR ---
    const handleAssign = async (orderId: number) => {
        if (!selectedDelivererId) {
            showToast('Veuillez sélectionner un livreur.', 'error');
            return;
        }

        try {
            const response = await axios.post(`/${secretPath}/orders/${orderId}/assign`, {
                deliverer_id: selectedDelivererId,
            });

            if (response.data.success) {
                showToast(response.data.message, 'success');
                setAssigningOrderId(null);
                setSelectedDelivererId('');

                if (response.data.whatsapp_link) {
                    window.open(response.data.whatsapp_link, '_blank');
                }

                router.reload();
            }
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Erreur lors de l\'assignation', 'error');
        }
    };

    // --- MARQUER COMME LIVRÉ ---
    const handleDeliver = async (orderId: number) => {
        if (!confirm('Marquer cette commande comme livrée ?')) return;
        try {
            const response = await axios.post(`/${secretPath}/orders/${orderId}/deliver`);
            if (response.data.success) {
                showToast(response.data.message, 'success');
                router.reload();
            }
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Erreur lors du changement de statut', 'error');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-yann-blue">Gestion des Commandes</h1>
            </div>

            {/* --- FILTRES --- */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { key: 'all', label: 'Toutes' },
                    { key: 'pending', label: 'En attente' },
                    { key: 'delivering', label: 'En cours' },
                    { key: 'delivered', label: 'Livrées' },
                ].map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key as any)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            filter === f.key
                            ? 'bg-yann-cyan text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* --- TABLEAU AVEC SCROLL HORIZONTAL (POUR MOBILE) --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                        <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                            <tr>
                                {/* Colonne gelée (sticky) pour le numéro de commande */}
                                <th className="px-4 py-3 font-semibold sticky left-0 bg-gray-50 z-10 min-w-[120px]">Commande</th>
                                <th className="px-4 py-3 font-semibold min-w-[140px]">Client</th>
                                <th className="px-4 py-3 font-semibold min-w-[180px]">Adresse</th>
                                <th className="px-4 py-3 font-semibold min-w-[120px]">Montant</th>
                                <th className="px-4 py-3 font-semibold min-w-[110px]">Statut</th>
                                <th className="px-4 py-3 font-semibold min-w-[130px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    {/* Colonne gelée : Numéro de commande */}
                                    <td className="px-4 py-2 font-medium text-yann-blue whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-100">
                                        #{order.invoice_number}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <div className="font-medium">{order.customer_name}</div>
                                        <div className="text-xs text-gray-500">{order.customer_phone}</div>
                                    </td>
                                    <td className="px-4 py-2 text-gray-600 whitespace-nowrap">
                                        {order.delivery_city}, {order.delivery_neighborhood}
                                    </td>
                                    <td className="px-4 py-2 font-semibold text-yann-cyan whitespace-nowrap">
                                        {new Intl.NumberFormat('fr-FR').format(order.total_amount)} FCFA
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            order.status === 'en_attente' ? 'bg-yellow-100 text-yellow-700' :
                                            order.status === 'en_cours' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'livré' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-500'
                                        }`}>
                                            {order.status === 'en_attente' ? 'En attente' :
                                             order.status === 'en_cours' ? 'En cours' :
                                             order.status === 'livré' ? 'Livrée' : order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                                        {order.status === 'en_attente' ? (
                                            <button
                                                onClick={() => {
                                                    setAssigningOrderId(order.id);
                                                    setSelectedDelivererId('');
                                                }}
                                                className="text-yann-cyan hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                                            >
                                                <FontAwesomeIcon icon={faUserCheck} size="sm" />
                                                Assigner
                                            </button>
                                        ) : order.status === 'en_cours' ? (
                                            <button
                                                onClick={() => handleDeliver(order.id)}
                                                className="text-green-600 hover:text-green-700 text-xs font-medium flex items-center gap-1"
                                            >
                                                <FontAwesomeIcon icon={faCheckCircle} size="sm" />
                                                Livrer
                                            </button>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODALE D'ASSIGNATION --- */}
            {assigningOrderId !== null && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-yann-blue">Assigner un livreur</h2>
                            <button onClick={() => setAssigningOrderId(null)} className="text-gray-400 hover:text-red-500">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Livreur</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={selectedDelivererId}
                                    onChange={(e) => setSelectedDelivererId(e.target.value)}
                                >
                                    <option value="">Sélectionner un livreur</option>
                                    {deliverers?.map(d => (
                                        <option key={d.id} value={String(d.id)}>
                                            {d.name} ({d.city})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={() => handleAssign(assigningOrderId)}
                                className="w-full bg-yann-cyan text-white py-2 rounded-lg font-medium hover:bg-cyan-600 transition-colors"
                            >
                                <FontAwesomeIcon icon={faWhatsapp} className="mr-2" />
                                Assigner & Ouvrir WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
