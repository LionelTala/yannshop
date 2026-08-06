import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useToast } from '@/contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTimes, faEye, faStar, faFire } from '@fortawesome/free-solid-svg-icons';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    promo_price: number | null;
    primary_image: string;
    stock: number;
    is_popular: boolean;
    is_promotional: boolean;
    category: Category;
    media?: { id?: number; type: string; url: string }[];
}

interface ProductsProps {
    products: Product[];
    categories: Category[];
}

Products.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default function Products({ products, categories }: ProductsProps) {
    const { showToast } = useToast();
    const secretPath = import.meta.env.VITE_ADMIN_SECRET_PATH || 'yann-gestion';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // --- ÉTAT DU FORMULAIRE ---
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        description: '',
        price: '',
        promo_price: '',
        stock: '0',
        is_popular: false,
        is_promotional: false,
    });

    // --- ÉTAT DES FICHIERS ---
    const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null);
    const [existingPrimaryImage, setExistingPrimaryImage] = useState<string | null>(null);
    const [media, setMedia] = useState<{ type: 'image' | 'video'; file: File | null }[]>([]);
    const [existingMedia, setExistingMedia] = useState<{ id?: number; type: string; url: string }[]>([]);

    // --- OUVRIR LA MODALE (Création) ---
    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '', category_id: '', description: '',
            price: '', promo_price: '', stock: '0',
            is_popular: false, is_promotional: false
        });
        setPrimaryImageFile(null);
        setExistingPrimaryImage(null);
        setMedia([]);
        setExistingMedia([]);
        setIsModalOpen(true);
    };

    // --- OUVRIR LA MODALE (Édition) ---
    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category_id: String(product.category.id),
            description: product.description || '',
            price: String(product.price),
            promo_price: product.promo_price ? String(product.promo_price) : '',
            stock: String(product.stock || 0),
            is_popular: product.is_popular ?? false,
            is_promotional: product.is_promotional ?? false,
        });
        setPrimaryImageFile(null);
        setExistingPrimaryImage(product.primary_image);
        setMedia([]);
        setExistingMedia(product.media || []);
        setIsModalOpen(true);
    };

    // --- PRÉVISUALISATION ---
    const getPrimaryImagePreview = () => {
        if (primaryImageFile) return URL.createObjectURL(primaryImageFile);
        if (existingPrimaryImage) return `/storage/${existingPrimaryImage}`;
        return null;
    };

    const getMediaPreview = (file: File | null, existingUrl: string | null) => {
        if (file) return URL.createObjectURL(file);
        if (existingUrl) return `/storage/${existingUrl}`;
        return null;
    };

    const handleRemoveExistingMedia = (index: number) => {
        setExistingMedia(prev => prev.filter((_, i) => i !== index));
    };

    // --- ENREGISTRER ---
    const handleSave = async () => {
        try {
            const formDataObj = new FormData();

            // Champs texte
            formDataObj.append('name', formData.name);
            formDataObj.append('category_id', formData.category_id);
            formDataObj.append('description', formData.description || '');
            formDataObj.append('price', formData.price);
            formDataObj.append('promo_price', formData.promo_price || '');
            formDataObj.append('stock', formData.stock);
            formDataObj.append('is_popular', formData.is_popular ? '1' : '0');
            formDataObj.append('is_promotional', formData.is_promotional ? '1' : '0');

            if (primaryImageFile) formDataObj.append('primary_image', primaryImageFile);

            media.forEach((item, index) => {
                if (item.file) {
                    formDataObj.append(`media[${index}][file]`, item.file);
                    formDataObj.append(`media[${index}][type]`, item.type);
                    formDataObj.append(`media[${index}][order_rank]`, String(index));
                }
            });

            if (editingProduct) {
                formDataObj.append('_method', 'PUT');
                await axios.post(`/${secretPath}/products/${editingProduct.id}`, formDataObj);
                showToast('Produit modifié avec succès', 'success');
            } else {
                await axios.post(`/${secretPath}/products`, formDataObj);
                showToast('Produit ajouté avec succès', 'success');
            }

            setIsModalOpen(false);
            router.reload();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Erreur lors de l\'enregistrement', 'error');
        }
    };

    // --- SUPPRIMER ---
    const handleDelete = async (id: number) => {
        if (!confirm('Es-tu sûr de vouloir supprimer ce produit ?')) return;
        try {
            await axios.delete(`/${secretPath}/products/${id}`);
            showToast('Produit supprimé', 'success');
            router.reload();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Erreur lors de la suppression', 'error');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(price);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-yann-blue">Gestion des Produits</h1>
                <button
                    onClick={openCreateModal}
                    className="bg-yann-cyan text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-cyan-600 transition-colors text-sm font-medium"
                >
                    <FontAwesomeIcon icon={faPlus} size="sm" />
                    Nouveau produit
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                {/* --- WRAPPER POUR SCROLL HORIZONTAL SUR MOBILE --- */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm min-w-[800px]">
                        <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 font-semibold sticky left-0 bg-gray-50 z-10 min-w-[140px]">Nom</th>
                                <th className="px-4 py-3 font-semibold min-w-[120px]">Catégorie</th>
                                <th className="px-4 py-3 font-semibold min-w-[120px]">Prix</th>
                                <th className="px-4 py-3 font-semibold min-w-[140px]">Image</th>
                                <th className="px-4 py-3 font-semibold min-w-[100px]">Promo</th>
                                <th className="px-4 py-3 font-semibold min-w-[100px]">Populaire</th>
                                <th className="px-4 py-3 text-right font-semibold min-w-[100px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products && products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-2 font-medium text-yann-blue whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-100">
                                        {product.name}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600 whitespace-nowrap">
                                        <span className="bg-yann-cyan/10 text-yann-cyan px-2 py-0.5 rounded-full text-xs font-medium">
                                            {product.category?.name || 'Sans catégorie'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 font-semibold text-gray-800 whitespace-nowrap">
                                        {formatPrice(product.price)}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {product.primary_image ? (
                                            <img
                                                src={`/storage/${product.primary_image}`}
                                                alt={product.name}
                                                className="w-10 h-10 rounded object-cover bg-gray-100 border border-gray-200"
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-400">Aucune</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {product.is_promotional ? (
                                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                                <FontAwesomeIcon icon={faFire} size="xs" className="mr-1" />
                                                Promo
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {product.is_popular ? (
                                            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                                <FontAwesomeIcon icon={faStar} size="xs" className="mr-1" />
                                                Populaire
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-right whitespace-nowrap flex justify-end gap-1.5">
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="text-yann-cyan hover:text-blue-700 p-1 rounded transition-colors"
                                            title="Modifier"
                                        >
                                            <FontAwesomeIcon icon={faEdit} size="sm" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
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

            {/* --- MODALE D'AJOUT / ÉDITION --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4 shrink-0">
                            <h2 className="text-xl font-bold text-yann-blue">
                                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="overflow-y-auto pr-2 space-y-4 flex-1">
                            {/* NOM */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* CATÉGORIE */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* PRIX */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>

                            {/* PRIX PROMO */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prix promotionnel (Optionnel)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    placeholder="Ex: 15000"
                                    value={formData.promo_price}
                                    onChange={(e) => setFormData({ ...formData, promo_price: e.target.value })}
                                />
                            </div>

                            {/* DESCRIPTION */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optionnel)</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none resize-none"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* STOCK */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock (Quantité)</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>

                            {/* IS POPULAR */}
                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_popular"
                                    checked={formData.is_popular}
                                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                                    className="w-4 h-4 text-yann-cyan rounded border-gray-300 focus:ring-yann-cyan"
                                />
                                <label htmlFor="is_popular" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                                    <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                                    Marquer comme populaire
                                </label>
                            </div>

                            {/* IS PROMOTIONAL */}
                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_promotional"
                                    checked={formData.is_promotional}
                                    onChange={(e) => setFormData({ ...formData, is_promotional: e.target.checked })}
                                    className="w-4 h-4 text-yann-cyan rounded border-gray-300 focus:ring-yann-cyan"
                                />
                                <label htmlFor="is_promotional" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                                    <FontAwesomeIcon icon={faFire} className="text-red-500" />
                                    Mettre en promotion
                                </label>
                            </div>

                            {/* IMAGE PRINCIPALE */}
                            <div className="border-t border-gray-100 pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image principale</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setPrimaryImageFile(e.target.files?.[0] || null)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                />
                                {getPrimaryImagePreview() && (
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-500 mb-1">Prévisualisation :</p>
                                        <img
                                            src={getPrimaryImagePreview()}
                                            alt="Image principale"
                                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* MÉDIAS */}
                            <div className="border-t border-gray-100 pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Médias (Images / Vidéos)</label>
                                {editingProduct && existingMedia.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {existingMedia.map((item, idx) => (
                                            <div key={idx} className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                {item.type === 'image' ? (
                                                    <img src={`/storage/${item.url}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <video src={`/storage/${item.url}`} className="w-full h-full object-cover" />
                                                )}
                                                <button
                                                    onClick={() => handleRemoveExistingMedia(idx)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-600 text-[10px]"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    {media.map((item, index) => (
                                        <div key={index} className="flex gap-2 items-start">
                                            <select
                                                value={item.type}
                                                onChange={(e) => {
                                                    const newMedia = [...media];
                                                    newMedia[index].type = e.target.value as 'image' | 'video';
                                                    setMedia(newMedia);
                                                }}
                                                className="px-3 py-2 border border-gray-200 rounded-lg"
                                            >
                                                <option value="image">Image</option>
                                                <option value="video">Vidéo</option>
                                            </select>
                                            <input
                                                type="file"
                                                accept={item.type === 'image' ? 'image/*' : 'video/*'}
                                                onChange={(e) => {
                                                    const newMedia = [...media];
                                                    newMedia[index].file = e.target.files?.[0] || null;
                                                    setMedia(newMedia);
                                                }}
                                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                                            />
                                            <button
                                                onClick={() => setMedia(media.filter((_, i) => i !== index))}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FontAwesomeIcon icon={faTrash} size="sm" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setMedia([...media, { type: 'image', file: null }])}
                                        className="text-yann-cyan text-sm font-medium hover:underline"
                                    >
                                        + Ajouter un média
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 shrink-0">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Annuler</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-yann-cyan text-white rounded-lg hover:bg-cyan-600 transition-colors">Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
