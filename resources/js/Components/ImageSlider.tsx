import { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faPlay, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ImageSliderProps {
    images: string[];
    videoUrl?: string | null;
}

const AUTOPLAY_DELAY = 4000; // ms entre chaque défilement automatique
const SWIPE_THRESHOLD = 50;  // px minimum pour considérer que c'est un swipe volontaire

export default function ImageSlider({ images, videoUrl }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const touchStartX = useRef<number | null>(null);
    const touchDeltaX = useRef(0);

    // 1. CORRECTION ICI : On utilise directement le tableau images (déjà préfixé par product.tsx)
    const displayImages = images.length > 0 ? images : ['/images/placeholder.jpg'];

    // 2. Navigation
    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    }, [displayImages.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    }, [displayImages.length]);

    const handleManualNav = (action: () => void) => {
        action();
        setIsPaused(false);
    };

    // --- DÉFILEMENT AUTOMATIQUE ---
    useEffect(() => {
        if (displayImages.length <= 1 || isPaused || isVideoOpen) return;

        const timer = setInterval(() => {
            goToNext();
        }, AUTOPLAY_DELAY);

        return () => clearInterval(timer);
    }, [displayImages.length, isPaused, isVideoOpen, goToNext, currentIndex]);

    // --- SWIPE TACTILE ---
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchDeltaX.current = 0;
        setIsPaused(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    };

    const handleTouchEnd = () => {
        if (Math.abs(touchDeltaX.current) > SWIPE_THRESHOLD) {
            if (touchDeltaX.current > 0) {
                goToPrevious();
            } else {
                goToNext();
            }
        }
        touchStartX.current = null;
        touchDeltaX.current = 0;
        setIsPaused(false);
    };

    return (
        <div
            className="relative w-full h-[500px] bg-gray-100 rounded-2xl overflow-hidden group touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >

            {/* --- IMAGE ACTUELLE --- */}
            <div className="w-full h-full relative">
                <img
                    src={displayImages[currentIndex]}
                    alt="Produit"
                    className="w-full h-full object-contain p-2 select-none transition-opacity duration-300"
                    draggable={false}
                />

                {/* Bouton Vidéo */}
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

            {/* --- FLÈCHES DE NAVIGATION --- */}
            {displayImages.length > 1 && (
                <>
                    <button
                        onClick={() => handleManualNav(goToPrevious)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10 cursor-pointer hidden md:flex"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="text-yann-blue text-xl" />
                    </button>
                    <button
                        onClick={() => handleManualNav(goToNext)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10 cursor-pointer hidden md:flex"
                    >
                        <FontAwesomeIcon icon={faArrowRight} className="text-yann-blue text-xl" />
                    </button>

                    {/* INDICATEURS */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                        {displayImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleManualNav(() => setCurrentIndex(index))}
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

            {/* --- MODALE VIDÉO --- */}
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
