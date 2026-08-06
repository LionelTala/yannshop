import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import { useToast } from '@/contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Category {
    id: number;
    name: string;
}

interface Media {
    id: number;
    type: 'image' | 'video';
    url: string;
    order_rank: number;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    primary_image: string;
    stock: number;
    category: Category;
    media: Media[];
}

interface ProductDetailProps {
    product: Product;
    categories: Category[];
}

// Limites côté client pour éviter d'envoyer un fichier trop lourd et de recevoir
// en retour une page d'erreur serveur brute (413/500) au lieu de JSON.
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5 Mo
const MAX_VIDEO_SIZE = 30 * 1024 * 1024;  // 30 Mo — à ajuster selon la config serveur réelle

ProductDetail.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default function ProductDetail({ product, categories }: ProductDetailProps) {
    const { showToast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [mediaList, setMediaList] = useState<Media[]>(product.media || []);
    const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
    const [newMediaFile, setNewMediaFile] = useState<File | null>(null);
    // Incrémenté pour forcer le remontage du <input type="file">, seul moyen fiable
    // de vider sa valeur affichée (un input file ne peut pas être "contrôlé").
    const [fileInputKey, setFileInputKey] = useState(0);

    const secretPath = import.meta.env.VITE_ADMIN_SECRET_PATH || 'yann-gestion';

    const handleUpload = async () => {
        if (!newMediaFile) {
            showToast('Veuillez sélectionner un fichier', 'error');
            return;
        }

        const maxSize = newMediaType === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
        if (newMediaFile.size > maxSize) {
            showToast(`Fichier trop volumineux (max ${Math.round(maxSize / 1024 / 1024)} Mo)`, 'error');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('type', newMediaType);
        formData.append('file', newMediaFile);

        try {
            const response = await axios.post(`/${secretPath}/products/${product.id}/media`, formData);

            if (response.data.success) {
                showToast(response.data.message || 'Média ajouté avec succès', 'success');

                if (response.data.media) {
                    setMediaList((prev) => [...prev, response.data.media]);
                } else {
                    router.reload({ only: ['product'] });
                }

                setNewMediaFile(null);
                setFileInputKey((k) => k + 1);
            } else {
                showToast(response.data.message || "Erreur lors de l'upload", 'error');
            }
        } catch (err: any) {
            // Si le serveur renvoie du HTML (erreur 413/500 brute) plutôt que du JSON,
            // err.response.data n'est pas un objet exploitable : on l'ignore proprement
            // au lieu de laisser planter le rendu.
            const isJsonError = err.response && typeof err.response.data === 'object';
            const message = isJsonError
                ? err.response.data?.message
                : null;

            showToast(
                message || "Erreur lors de l'upload. Le fichier est peut-être trop volumineux.",
                'error'
            );
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteMedia = async (mediaId: number) => {
        if (!confirm('Supprimer ce média ?')) return;
        try {
            const response = await axios.delete(`/${secretPath}/products/media/${mediaId}`);
            if (response.data.success) {
                showToast(response.data.message || 'Média supprimé', 'success');
                setMediaList((prev) => prev.filter(m => m.id !== mediaId));
            } else {
                showToast(response.data.message || 'Erreur lors de la suppression', 'error');
            }
        } catch (err: any) {
            const isJsonError = err.response && typeof err.response.data === 'object';
            const message = isJsonError ? err.response.data?.message : null;
            showToast(message || 'Erreur lors de la suppression', 'error');
        }
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link href={`/${secretPath}/products`} className="text-gray-600 hover:text-yann-cyan transition-colors">
                    <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                </Link>
                <h1 className="text-2xl font-bold text-yann-blue">Détail du produit</h1>
            </div>

            {/* --- INFOS PRODUIT --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-yann-blue mb-4">Informations</h2>
                    <div className="space-y-3">
                        <div><span className="text-gray-500 text-sm">Nom :</span> <span className="font-medium">{product.name}</span></div>
                        <div><span className="text-gray-500 text-sm">Catégorie :</span> <span className="font-medium">{product.category?.name || 'Sans catégorie'}</span></div>
                        <div><span className="text-gray-500 text-sm">Prix :</span> <span className="font-medium text-yann-cyan">{new Intl.NumberFormat('fr-FR').format(product.price)} FCFA</span></div>
                        <div><span className="text-gray-500 text-sm">Stock :</span> <span className="font-medium">{product.stock}</span></div>
                        <div><span className="text-gray-500 text-sm">Description :</span> <p className="text-gray-700 whitespace-pre-wrap">{product.description || '-'}</p></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-yann-blue mb-4">Image principale</h2>
                    {product.primary_image ? (
                        <img
                            src={`/storage/${product.primary_image}`}
                            alt={product.name}
                            className="w-full max-h-64 object-contain rounded-lg bg-gray-50 border border-gray-200"
                        />
                    ) : (
                        <p className="text-gray-400 text-sm">Aucune image principale</p>
                    )}
                </div>
            </div>

            {/* --- GESTION DES MÉDIAS --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h2 className="text-lg font-semibold text-yann-blue">Médias (Images / Vidéos)</h2>
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <select
                            value={newMediaType}
                            onChange={(e) => setNewMediaType(e.target.value as 'image' | 'video')}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none"
                        >
                            <option value="image">Image</option>
                            <option value="video">Vidéo</option>
                        </select>
                        <input
                            key={fileInputKey}
                            type="file"
                            accept={newMediaType === 'image' ? 'image/*' : 'video/*'}
                            onChange={(e) => setNewMediaFile(e.target.files?.[0] || null)}
                            className="flex-1 md:flex-none px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                        />
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={uploading}
                            className="bg-yann-cyan text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                            {uploading ? 'Upload...' : <><FontAwesomeIcon icon={faPlus} size="sm" /> Ajouter</>}
                        </button>
                    </div>
                </div>

                {/* Liste des médias */}
                {mediaList.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Aucun média pour ce produit.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {mediaList.map((media) => (
                            <div key={media.id} className="relative group bg-gray-50 rounded-lg overflow-hidden border border-gray-200 aspect-square">
                                {media.type === 'image' ? (
                                    <img
                                        src={`/storage/${media.url}`}
                                        alt="Média"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <video
                                        src={`/storage/${media.url}`}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteMedia(media.id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                                    title="Supprimer ce média"
                                >
                                    <FontAwesomeIcon icon={faTrash} size="sm" />
                                </button>
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded uppercase font-semibold">
                                    {media.type}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
