import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useToast } from '@/contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTimes, faEye } from '@fortawesome/free-solid-svg-icons';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

interface CategoriesProps {
    categories: Category[];
}

Categories.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default function Categories({ categories }: CategoriesProps) {
    const { showToast } = useToast();
    const secretPath = import.meta.env.VITE_ADMIN_SECRET_PATH || 'yann-gestion';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    // --- OUVRIR LA MODALE ---
    const openCreateModal = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description || '' });
        setIsModalOpen(true);
    };

    // --- ENREGISTRER (Ajout ou Modification) ---
    const handleSave = async () => {
        try {
            if (editingCategory) {
                await axios.put(`/${secretPath}/categories/${editingCategory.id}`, formData);
                showToast('Catégorie modifiée avec succès', 'success');
            } else {
                await axios.post(`/${secretPath}/categories`, formData);
                showToast('Catégorie ajoutée avec succès', 'success');
            }

            setIsModalOpen(false);
            router.reload({ only: ['categories'] });

        } catch (err: any) {
            const message = err.response?.data?.message || 'Erreur lors de l\'enregistrement';
            showToast(message, 'error');
        }
    };

    // --- SUPPRIMER ---
    const handleDelete = async (id: number) => {
        if (!confirm('Es-tu sûr de vouloir supprimer cette catégorie ?')) return;
        try {
            await axios.delete(`/${secretPath}/categories/${id}`);
            showToast('Catégorie supprimée', 'success');
            router.reload({ only: ['categories'] });
        } catch (err: any) {
            const message = err.response?.data?.message || 'Erreur lors de la suppression';
            showToast(message, 'error');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-yann-blue">Gestion des Catégories</h1>
                <button
                    onClick={openCreateModal}
                    className="bg-yann-cyan text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyan-600 transition-colors text-sm font-medium"
                >
                    <FontAwesomeIcon icon={faPlus} size="sm" />
                    Nouvelle catégorie
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                {/* --- WRAPPER POUR SCROLL HORIZONTAL SUR MOBILE --- */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 font-semibold sticky left-0 bg-gray-50 z-10 min-w-[130px]">Nom</th>
                                <th className="px-4 py-3 font-semibold min-w-[130px]">Slug</th>
                                <th className="px-4 py-3 font-semibold min-w-[150px]">Description</th>
                                <th className="px-4 py-3 font-semibold text-right min-w-[100px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories && categories.map(category => (
                                <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-2 font-medium text-yann-blue whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-100">
                                        {category.name}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600 whitespace-nowrap font-mono text-xs">{category.slug}</td>
                                    <td
                                        className="px-4 py-2 text-gray-500 truncate max-w-0"
                                        title={category.description || ''}
                                    >
                                        {category.description || '-'}
                                    </td>

                                    {/* --- ACTIONS TOUJOURS VISIBLES --- */}
                                    <td className="px-4 py-2 text-right whitespace-nowrap flex justify-end gap-1.5">
                                        <button
                                            onClick={() => openEditModal(category)}
                                            className="text-yann-cyan hover:text-blue-700 p-1 rounded transition-colors"
                                            title="Modifier"
                                        >
                                            <FontAwesomeIcon icon={faEdit} size="sm" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                                            title="Supprimer"
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

            {/* MODALE D'AJOUT / ÉDITION */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-yann-blue">
                                {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optionnel)</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none resize-none"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
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
