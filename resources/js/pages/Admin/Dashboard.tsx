import AdminLayout from '@/Layouts/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox, faTruck, faCheckCircle, faClock, faUsers,
    faTag, faEnvelope, faEye, faChartLine
} from '@fortawesome/free-solid-svg-icons';

Dashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

interface DashboardProps {
    stats: {
        // Commandes
        orders_total: number;
        orders_pending: number;
        orders_delivering: number;
        orders_delivered: number;

        // E-Commerce
        products_total: number;
        categories_total: number;

        // Communication
        messages_unread: number;

        // Trafic
        visits_today: number;
        visits_total: number;
    };
    latestOrders: any[];
}

export default function Dashboard({ stats, latestOrders }: DashboardProps) {
    return (
        <div>
            <h1 className="text-2xl font-bold text-yann-blue mb-6">Tableau de bord</h1>

            {/* --- SECTION 1 : WIDGETS COMMANDES --- */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-yann-blue mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBox} className="text-yann-cyan" />
                    Aperçu des commandes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="text-gray-500 text-sm">Total</div>
                        <div className="text-3xl font-bold text-yann-blue mt-1">{stats.orders_total}</div>
                    </div>
                    <div className="bg-yellow-50 p-6 rounded-2xl shadow-sm border border-yellow-100 relative overflow-hidden">
                        <div className="text-yellow-700 text-sm">En attente</div>
                        <div className="text-3xl font-bold text-yellow-700 mt-1">{stats.orders_pending}</div>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden">
                        <div className="text-blue-700 text-sm">En cours</div>
                        <div className="text-3xl font-bold text-blue-700 mt-1">{stats.orders_delivering}</div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100 relative overflow-hidden">
                        <div className="text-green-700 text-sm">Livrées</div>
                        <div className="text-3xl font-bold text-green-700 mt-1">{stats.orders_delivered}</div>
                    </div>
                </div>
            </div>

            {/* --- SECTION 2 : WIDGETS E-COMMERCE & MESSAGES --- */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-yann-blue mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faChartLine} className="text-yann-cyan" />
                    État de la boutique
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="text-gray-500 text-sm">Produits</div>
                        <div className="text-3xl font-bold text-yann-blue mt-1">{stats.products_total}</div>
                        <div className="absolute right-4 top-4 text-yann-cyan/20 text-4xl">
                            <FontAwesomeIcon icon={faTag} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="text-gray-500 text-sm">Catégories</div>
                        <div className="text-3xl font-bold text-yann-blue mt-1">{stats.categories_total}</div>
                        <div className="absolute right-4 top-4 text-gray-200 text-4xl">
                            <FontAwesomeIcon icon={faTag} />
                        </div>
                    </div>
                    <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100 relative overflow-hidden">
                        <div className="text-red-700 text-sm">Messages non lus</div>
                        <div className="text-3xl font-bold text-red-700 mt-1">{stats.messages_unread}</div>
                        <div className="absolute right-4 top-4 text-red-200 text-4xl">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECTION 3 : WIDGETS TRAFIC (Visites) --- */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-yann-blue mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faEye} className="text-yann-cyan" />
                    Trafic du site
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="text-gray-500 text-sm">Visites aujourd'hui</div>
                        <div className="text-3xl font-bold text-yann-cyan mt-1">{stats.visits_today}</div>
                        <div className="absolute right-4 top-4 text-gray-200 text-4xl">
                            <FontAwesomeIcon icon={faEye} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="text-gray-500 text-sm">Visites totales</div>
                        <div className="text-3xl font-bold text-yann-blue mt-1">{stats.visits_total}</div>
                        <div className="absolute right-4 top-4 text-gray-200 text-4xl">
                            <FontAwesomeIcon icon={faEye} />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECTION 4 : DERNIÈRES COMMANDES (Tableau) --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-yann-blue">Dernières commandes</h3>
                    <span className="text-xs text-gray-400">{stats.orders_total} commandes au total</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Commande</th>
                                <th className="px-6 py-3">Client</th>
                                <th className="px-6 py-3">Montant</th>
                                <th className="px-6 py-3">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {latestOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-yann-blue">#{order.invoice_number}</td>
                                    <td className="px-6 py-4">{order.customer_name}</td>
                                    <td className="px-6 py-4 font-semibold text-yann-cyan">
                                        {new Intl.NumberFormat('fr-FR').format(order.total_amount)} FCFA
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            order.status === 'en_attente' ? 'bg-yellow-100 text-yellow-700' :
                                            order.status === 'en_cours' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'livré' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {order.status === 'en_attente' ? 'En attente' :
                                             order.status === 'en_cours' ? 'En cours' :
                                             order.status === 'livré' ? 'Livré' : order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
