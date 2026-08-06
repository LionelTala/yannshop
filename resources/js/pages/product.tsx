import PublicLayout from '@/Layouts/PublicLayout';
import ImageSlider from '@/Components/ImageSlider';
import { useCart } from '@/contexts/CartContext';
import FloatingCart from '@/Components/FloatingCart';

// Interface des données reçues de Laravel
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
    description: string;
    price: number;
    promo_price: number | null;
    primary_image: string;
    media?: Media[]; // <-- REMPLACÉ images par media
    category: { name: string };
}

interface ProductProps {
    product: Product;
}

// --- La fonction s'appelle 'product' (minuscule) car le fichier s'appelle 'product.tsx' ---
export default function product({ product }: ProductProps) {
    const { addToCart } = useCart();

    // Sécurité : si le produit n'est pas trouvé
    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-red-500">Produit introuvable</h2>
            </div>
        );
    }

    // --- PRÉPARATION DES MÉDIAS ---
    // 1. Récupérer uniquement les images depuis les médias
    const mediaImages = product.media
        ?.filter((m: Media) => m.type === 'image')
        .sort((a: Media, b: Media) => a.order_rank - b.order_rank)
        .map((m: Media) => m.url) || [];

    // 2. Tableau complet (Image principale + images secondaires)
    const allImages = [
        product.primary_image,
        ...mediaImages,
    ];

    // 3. Récupérer la vidéo (s'il y en a une)
    const videoUrl = product.media?.find((m: Media) => m.type === 'video')?.url || null;

    // Calcul du prix affiché
    const displayPrice = product.promo_price && product.promo_price > 0
        ? product.promo_price
        : product.price;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* --- LE PANIER FLOTTANT AJOUTÉ ICI --- */}
            <div className="fixed bottom-10 right-8 z-50">
                <FloatingCart />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* --- COLONNE GAUCHE : IMAGES & VIDÉO --- */}
                <div className="space-y-4">
                    <ImageSlider
                        images={allImages}
                        videoUrl={videoUrl}
                    />
                </div>

                {/* --- COLONNE DROITE : INFORMATIONS PRODUIT --- */}
                <div className="space-y-6">
                    {/* Catégorie */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                            {product.category?.name || 'Catégorie'}
                        </span>
                    </div>

                    {/* Titre */}
                    <h1 className="text-3xl font-bold text-yann-blue">
                        {product.name}
                    </h1>

                    {/* Prix */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-yann-cyan">
                            {new Intl.NumberFormat('fr-FR').format(displayPrice)} FCFA
                        </span>
                        {product.promo_price && product.promo_price > 0 && (
                            <span className="text-lg text-gray-400 line-through">
                                {new Intl.NumberFormat('fr-FR').format(product.price)} FCFA
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="prose prose-sm max-w-none text-gray-600">
                        <p className="whitespace-pre-wrap leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Bouton Ajouter au panier */}
                    <div className="pt-4 border-t border-gray-100">
                        <button
                            onClick={() => addToCart({
                                id: product.id,
                                name: product.name,
                                price: displayPrice,
                                primary_image: product.primary_image
                            }, 1)}
                            className="w-full bg-yann-blue text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Ajouter au panier
                        </button>
                    </div>

                    {/* Infos livraison */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600 space-y-1">
                        <p>🚚 <span className="font-medium">Livraison :</span> Yaoundé & Douala</p>
                        <p>⏱️ <span className="font-medium">Délai :</span> 24h à 48h</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- C'EST ICI QU'ON DÉFINIT LE LAYOUT (PUBLIC) ---
product.layout = (page: React.ReactNode) => (
    <PublicLayout socials={{
        facebook: 'https://facebook.com/yannshop',
        instagram: 'https://instagram.com/yannshop',
        whatsapp: 'https://wa.me/237691234567'
    }}>
        {page}
    </PublicLayout>
);
