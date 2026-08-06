import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useToast } from '@/contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope, faCheckCircle, faClock, faEye,
    faUser, faPhone, faTrash, faFilter
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp as faWhatsappBrand } from '@fortawesome/free-brands-svg-icons';

interface Message {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    subject: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface MessagesProps {
    messages: Message[];
}

Messages.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default function Messages({ messages }: MessagesProps) {
    const { showToast } = useToast();
    const secretPath = import.meta.env.VITE_ADMIN_SECRET_PATH || 'yann-gestion';

    // --- FILTRE PAR DÉFAUT : NON LU UNIQUEMENT ---
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('unread');

    // --- FILTRAGE & TRI ---
    const filteredMessages = useMemo(() => {
        let filtered = [...messages];

        // 1. Filtrage
        if (filter === 'unread') {
            filtered = filtered.filter(msg => !msg.is_read);
        } else if (filter === 'read') {
            filtered = filtered.filter(msg => msg.is_read);
        }

        // 2. Tri : Les plus récents d'abord
        return filtered.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }, [messages, filter]);

    // --- OUVRIR WHATSAPP ---
    const handleWhatsApp = (phone: string) => {
        const cleanPhone = phone.replace(/\s/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    };

    // --- MARQUER COMME LU ---
    const handleMarkAsRead = async (id: number) => {
        try {
            await axios.post(`/${secretPath}/messages/${id}/read`);
            showToast('Message marqué comme lu', 'success');
            router.reload();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Erreur lors du marquage', 'error');
        }
    };

    // --- MARQUER COMME NON LU ---
    const handleMarkAsUnread = async (id: number) => {
        try {
            await axios.post(`/${secretPath}/messages/${id}/unread`);
            showToast('Message marqué comme non lu', 'success');
            router.reload();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Erreur lors du marquage', 'error');
        }
    };

    // --- SUPPRIMER ---
    const handleDelete = async (id: number) => {
        if (!confirm('Es-tu sûr de vouloir supprimer ce message ?')) return;
        try {
            await axios.delete(`/${secretPath}/messages/${id}`);
            showToast('Message supprimé avec succès', 'success');
            router.reload();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Erreur lors de la suppression', 'error');
        }
    };

    // --- FORMATAGE DE LA DATE ---
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-yann-blue">Messages des clients</h1>
                <span className="text-sm text-gray-500">{messages.length} message(s)</span>
            </div>

            {/* --- FILTRES --- */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                    <FontAwesomeIcon icon={faFilter} size="sm" />
                    Filtrer :
                </span>
                <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        filter === 'unread'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Non lus
                </button>
                <button
                    onClick={() => setFilter('read')}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        filter === 'read'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Lus
                </button>
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        filter === 'all'
                        ? 'bg-yann-cyan text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Tous
                </button>
            </div>

            {/* --- GRILLE DE CARTES --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMessages.map(message => (
                    <div
                        key={message.id}
                        className={`bg-white rounded-2xl shadow-sm border p-6 transition-all duration-300 ${
                            message.is_read
                            ? 'border-gray-100 hover:shadow-md'
                            : 'border-red-200 bg-red-50/30 hover:shadow-md'
                        }`}
                    >
                        {/* --- EN-TÊTE : CLIENT & STATUT --- */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-yann-blue text-lg flex items-center gap-2">
                                    <FontAwesomeIcon icon={faUser} className="text-gray-400 text-sm" />
                                    {message.name}
                                </h3>
                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                    <FontAwesomeIcon icon={faPhone} className="text-xs" />
                                    {message.phone}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                {message.is_read ? (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                        <FontAwesomeIcon icon={faCheckCircle} size="xs" />
                                        Lu
                                    </span>
                                ) : (
                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                        <FontAwesomeIcon icon={faClock} size="xs" />
                                        Non lu
                                    </span>
                                )}
                                <span className="text-xs text-gray-400">
                                    {formatDate(message.created_at)}
                                </span>
                            </div>
                        </div>

                        {/* --- SUJET --- */}
                        <div className="mb-3">
                            <h4 className="font-semibold text-yann-cyan text-sm">
                                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-xs" />
                                {message.subject}
                            </h4>
                        </div>

                        {/* --- MESSAGE (Complet, pas coupé) --- */}
                        <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mb-4 max-h-48 overflow-y-auto border border-gray-100">
                            {message.message}
                        </div>

                        {/* --- ACTIONS --- */}
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 flex-wrap">
                            <button
                                onClick={() => handleWhatsApp(message.phone)}
                                className="flex-1 min-w-[100px] bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <FontAwesomeIcon icon={faWhatsappBrand} size="sm" />
                                WhatsApp
                            </button>

                            {message.is_read ? (
                                <button
                                    onClick={() => handleMarkAsUnread(message.id)}
                                    className="flex-1 min-w-[80px] bg-yann-cyan/10 text-yann-cyan py-2 rounded-lg text-sm font-medium hover:bg-yann-cyan hover:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faEye} size="sm" />
                                    Non lu
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleMarkAsRead(message.id)}
                                    className="flex-1 min-w-[80px] bg-green-100 text-green-700 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faCheckCircle} size="sm" />
                                    Lu
                                </button>
                            )}

                            <button
                                onClick={() => handleDelete(message.id)}
                                className="text-red-500 hover:text-red-700 p-2 rounded-full transition-colors"
                                title="Supprimer"
                            >
                                <FontAwesomeIcon icon={faTrash} size="sm" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredMessages.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <FontAwesomeIcon icon={faEnvelope} className="text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">
                        {filter === 'unread' ? 'Aucun message non lu.' :
                         filter === 'read' ? 'Aucun message lu.' :
                         'Aucun message pour le moment.'}
                    </p>
                </div>
            )}
        </div>
    );
}
