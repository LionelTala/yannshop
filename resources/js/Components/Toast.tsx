import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

export default function Toast({ message, type = 'info', duration = 4000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleTransitionEnd = () => {
        if (!isVisible) {
            onClose();
        }
    };

    if (!isVisible) return null;

    const colors = {
        success: 'bg-green-50 border-green-200 text-green-700',
        error: 'bg-red-50 border-red-200 text-red-700',
        info: 'bg-blue-50 border-blue-200 text-blue-700',
    };

    const icons = {
        success: faCheckCircle,
        error: faExclamationCircle,
        info: faInfoCircle,
    };

    return (
        <div
            className={`fixed bottom-24 right-8 z-[100] max-w-sm w-full p-4 rounded-xl border shadow-lg transform transition-all duration-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            } ${colors[type]}`}
            onTransitionEnd={handleTransitionEnd}
        >
            <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={icons[type]} className="text-xl mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm font-medium">{message}</p>
                </div>
            </div>
        </div>
    );
}
