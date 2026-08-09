import { withPublicLayout } from '@/Layouts/PublicLayout';
import ImageSlider from '@/Components/ImageSlider';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Truck, Clock } from 'lucide-react';

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
    media?: Media[];
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
                <h2 className="text-2xl font-bold text-destructive">Produit introuvable</h2>
            </div>
        );
    }

    // Gestion des images locales
    const getImageSrc = (src: string) => {
        if (!src) return '/placeholder.svg';
        if (src.startsWith('http')) return src;
        return `/storage/${src}`;
    };

    // --- PRÉPARATION DES MÉDIAS ---
    const mediaImages = product.media
        ?.filter((m: Media) => m.type === 'image')
        .sort((a: Media, b: Media) => a.order_rank - b.order_rank)
        .map((m: Media) => getImageSrc(m.url)) || [];

    const allImages = [
        getImageSrc(product.primary_image),
        ...mediaImages,
    ];

    const videoUrl = product.media?.find((m: Media) => m.type === 'video')?.url || null;

    // Calcul du prix affiché
    const displayPrice = product.promo_price && product.promo_price > 0
        ? product.promo_price
        : product.price;

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* --- COLONNE GAUCHE : IMAGES & VIDÉO (Slider) --- */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <ImageSlider
                            images={allImages}
                            videoUrl={videoUrl}
                        />
                    </div>
                </div>

                {/* --- COLONNE DROITE : INFORMATIONS PRODUIT --- */}
                <div className="space-y-8 bg-card rounded-2xl border border-border p-8 shadow-sm h-fit">
                    {/* Catégorie */}
                    <div className="flex items-center gap-2">
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                            {product.category?.name || 'Catégorie'}
                        </span>
                    </div>

                    {/* Titre */}
                    <h1 className="text-balance text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                        {product.name}
                    </h1>

                    {/* Prix */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-extrabold text-primary">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(displayPrice)}
                        </span>
                        {product.promo_price && product.promo_price > 0 && (
                            <span className="text-lg text-muted-foreground line-through">
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(product.price)}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                        <p className="whitespace-pre-wrap leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Bouton Ajouter au panier */}
                    <div className="pt-6 border-t border-border">
                        <button
                            onClick={() => addToCart({
                                id: product.id,
                                name: product.name,
                                price: displayPrice,
                                primary_image: product.primary_image
                            }, 1)}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm"
                        >
                            <ShoppingBag className="size-5" />
                            Ajouter au panier
                        </button>
                    </div>

                    {/* Infos livraison */}
                    <div className="rounded-xl bg-secondary/50 p-5 text-sm space-y-3">
                        <div className="flex items-center gap-3">
                            <Truck className="size-5 text-primary" />
                            <span className="font-medium text-card-foreground">Livraison :</span>
                            <span className="text-muted-foreground">Yaoundé & Douala</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="size-5 text-primary" />
                            <span className="font-medium text-card-foreground">Délai :</span>
                            <span className="text-muted-foreground">24h à 48h</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- LAYOUT ---
product.layout = withPublicLayout;
