import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faPlay, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ImageSliderProps {
    images: string[];
    videoUrl?: string | null;
}

export default function ImageSlider({ images, videoUrl }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    // 1. Correction des chemins d'images
    const processedImages = images
        .map(img => img.startsWith('http') ? img : `/storage/${img}`)
        .filter(img => img && img.length > 0); // Enlever les images vides

    // 2. Sécurité : Si aucune image valide, on affiche un placeholder
    const displayImages = processedImages.length > 0 ? processedImages : ['/images/placeholder.jpg'];

    // 3. Navigation (basée sur displayImages)
    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? displayImages.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === displayImages.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="relative w-full h-[500px] bg-gray-100 rounded-2xl overflow-hidden group touch-none">

            {/* --- IMAGE ACTUELLE --- */}
            <div className="w-full h-full relative">
                <img
                    src={displayImages[currentIndex]}
                    alt="Produit"
                    className="w-full h-full object-cover"
                />

                {/* Bouton Vidéo (si une vidéo existe) */}
                {videoUrl && (
                    <button
                        onClick={() => setIsVideoOpen(true)}
                        className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md text-yann-blue px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-yann-cyan hover:text-white transition-all duration-300"
                    >
                        <FontAwesomeIcon icon={faPlay} className="text-sm" />
                        <span className="text-xs font-semibold">Vidéo</span>
                    </button>
                )}
            </div>

            {/* --- FLÈCHES DE NAVIGATION (basées sur displayImages) --- */}
            {displayImages.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10 cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="text-yann-blue text-xl" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10 cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faArrowRight} className="text-yann-blue text-xl" />
                    </button>

                    {/* INDICATEURS (Dots) toujours visibles */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                        {displayImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`transition-all duration-300 cursor-pointer ${
                                    currentIndex === index
                                    ? 'w-10 h-2.5 bg-yann-cyan rounded-full'
                                    : 'w-2.5 h-2.5 bg-white/80 rounded-full hover:bg-white'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* --- MODALE VIDÉO (Lightbox) --- */}
            {isVideoOpen && videoUrl && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden">
                        <button
                            onClick={() => setIsVideoOpen(false)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white z-10 text-2xl"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <video
                            src={videoUrl}
                            controls
                            autoPlay
                            className="w-full h-auto aspect-video rounded-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
