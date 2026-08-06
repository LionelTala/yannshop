import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useToast } from '@/contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTimes, faTruck } from '@fortawesome/free-solid-svg-icons';

interface Deliverer {
    id: number;
    name: string;
    phone: string;
    city: string;
    is_active: boolean;
    delivery_count: number;
}

interface DeliverersProps {
    deliverers: Deliverer[];
}

Deliverers.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default function Deliverers({ deliverers }: DeliverersProps) {
    const { showToast } = useToast();
    const secretPath = import.meta.env.VITE_ADMIN_SECRET_PATH || 'yann-gestion';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDeliverer, setEditingDeliverer] = useState<Deliverer | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: 'Yaoundé',
    });

    // --- OUVRIR LA MODALE ---
    const openCreateModal = () => {
        setEditingDeliverer(null);
        setFormData({ name: '', phone: '', city: 'Yaoundé' });
        setIsModalOpen(true);
    };

    const openEditModal = (deliverer: Deliverer) => {
        setEditingDeliverer(deliverer);
        setFormData({
            name: deliverer.name,
            phone: deliverer.phone,
            city: deliverer.city,
        });
        setIsModalOpen(true);
    };

    // --- ENREGISTRER ---
    const handleSave = async () => {
        try {
            if (editingDeliverer) {
                await axios.put(`/${secretPath}/deliverers/${editingDeliverer.id}`, formData);
                showToast('Livreur modifié avec succès', 'success');
            } else {
                await axios.post(`/${secretPath}/deliverers`, formData);
                showToast('Livreur ajouté avec succès', 'success');
            }
            setIsModalOpen(false);
            router.reload();
        } catch (err: any) {
            const message = err.response?.data?.message || 'Erreur lors de l\'enregistrement';
            const errors = err.response?.data?.errors;
            if (errors) {
                // Affiche la première erreur de validation
                const firstError = Object.values(errors)[0] as string[];
                showToast(firstError?.[0] || message, 'error');
            } else {
                showToast(message, 'error');
            }
        }
    };

    // --- SUPPRIMER ---
    const handleDelete = async (id: number) => {
        if (!confirm('Es-tu sûr de vouloir supprimer ce livreur ?')) return;
        try {
            await axios.delete(`/${secretPath}/deliverers/${id}`);
            showToast('Livreur supprimé', 'success');
            router.reload();
        } catch (err: any) {
            const message = err.response?.data?.message || 'Erreur lors de la suppression';
            showToast(message, 'error');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-yann-blue">Gestion des Livreurs</h1>
                <button
                    onClick={openCreateModal}
                    className="bg-yann-cyan text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyan-600 transition-colors text-sm font-medium"
                >
                    <FontAwesomeIcon icon={faPlus} size="sm" />
                    Ajouter un livreur
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                {/* --- WRAPPER POUR SCROLL HORIZONTAL SUR MOBILE --- */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 font-semibold sticky left-0 bg-gray-50 z-10 min-w-[130px]">Nom</th>
                                <th className="px-4 py-3 font-semibold min-w-[130px]">Téléphone</th>
                                <th className="px-4 py-3 font-semibold min-w-[100px]">Ville</th>
                                <th className="px-4 py-3 font-semibold min-w-[100px]">Statut</th>
                                <th className="px-4 py-3 font-semibold text-right min-w-[100px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {deliverers?.map(deliverer => (
                                <tr key={deliverer.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-2 font-medium text-yann-blue whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-100">
                                        {deliverer.name}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{deliverer.phone}</td>
                                    <td className="px-4 py-2 text-gray-600 whitespace-nowrap">
                                        <span className="bg-yann-cyan/10 text-yann-cyan px-2 py-0.5 rounded-full text-xs font-medium">
                                            {deliverer.city}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            deliverer.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {deliverer.is_active ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-right whitespace-nowrap flex justify-end gap-1.5">
                                        <button
                                            onClick={() => openEditModal(deliverer)}
                                            className="text-yann-cyan hover:text-blue-700 p-1 rounded transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faEdit} size="sm" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(deliverer.id)}
                                            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="sm" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODALE D'AJOUT / ÉDITION --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-yann-blue">
                                {editingDeliverer ? 'Modifier le livreur' : 'Ajouter un livreur'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone (WhatsApp)</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    placeholder="Ex: 691234567"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                >
                                    <option value="Yaoundé">Yaoundé</option>
                                    <option value="Douala">Douala</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Annuler</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-yann-cyan text-white rounded-lg hover:bg-cyan-600 transition-colors">Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
