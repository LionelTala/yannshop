import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useToast } from '@/contexts/ToastContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faEnvelope, faLock, faSave,
    faEye, faEyeSlash, faUserPlus, faTrash
} from '@fortawesome/free-solid-svg-icons';

interface User {
    id: number;
    name: string;
    email: string;
}

interface ProfileProps {
    user: User;
    users: User[];
}

Profile.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default function Profile({ user, users: initialUsers }: ProfileProps) {
    const { showToast } = useToast();
    const secretPath = import.meta.env.VITE_ADMIN_SECRET_PATH || 'yann-gestion';

    // --- PROFIL STATE ---
    const [profile, setProfile] = useState({
        name: user.name,
        email: user.email,
    });

    // --- PASSWORD STATE ---
    const [password, setPassword] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    // --- NOUVEL UTILISATEUR STATE ---
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [showNewUserPassword, setShowNewUserPassword] = useState(false);

    // --- LOADING STATES ---
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

    // --- METTRE À JOUR LE PROFIL ---
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const response = await axios.put(`/${secretPath}/profile`, profile);
            if (response.data.success) {
                showToast(response.data.message, 'success');
                router.reload();
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Erreur lors de la mise à jour';
            showToast(message, 'error');
        } finally {
            setIsSavingProfile(false);
        }
    };

    // --- CHANGER LE MOT DE PASSE ---
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingPassword(true);
        try {
            const response = await axios.put(`/${secretPath}/profile/password`, password);
            if (response.data.success) {
                showToast(response.data.message, 'success');
                setPassword({
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: '',
                });
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Erreur lors du changement de mot de passe';
            showToast(message, 'error');
        } finally {
            setIsSavingPassword(false);
        }
    };

    // --- CRÉER UN NOUVEL UTILISATEUR ---
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newUser.password !== newUser.password_confirmation) {
            showToast('Les mots de passe ne correspondent pas.', 'error');
            return;
        }

        setIsCreatingUser(true);
        try {
            const response = await axios.post(`/${secretPath}/profile/users`, newUser);
            if (response.data.success) {
                showToast(response.data.message, 'success');
                setUsers((prev) => [...prev, response.data.user]);
                setNewUser({ name: '', email: '', password: '', password_confirmation: '' });
            }
        } catch (err: any) {
            const message = err.response?.data?.message || "Erreur lors de la création de l'utilisateur";
            showToast(message, 'error');
        } finally {
            setIsCreatingUser(false);
        }
    };

    // --- SUPPRIMER UN UTILISATEUR ---
    const handleDeleteUser = async (userId: number) => {
        if (!confirm('Supprimer cet utilisateur admin ? Cette action est irréversible.')) return;

        setDeletingUserId(userId);
        try {
            const response = await axios.delete(`/${secretPath}/profile/users/${userId}`);
            if (response.data.success) {
                showToast(response.data.message, 'success');
                setUsers((prev) => prev.filter((u) => u.id !== userId));
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Erreur lors de la suppression';
            showToast(message, 'error');
        } finally {
            setDeletingUserId(null);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-yann-blue mb-6">Mon Profil</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* --- CARTE INFOS PROFIL --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-yann-blue mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-yann-cyan" />
                        Informations personnelles
                    </h2>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <FontAwesomeIcon icon={faUser} className="text-sm" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSavingProfile}
                            className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                                isSavingProfile
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-yann-cyan text-white hover:bg-cyan-600'
                            }`}
                        >
                            {isSavingProfile ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faSave} size="sm" />
                                    Enregistrer
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* --- CARTE MOT DE PASSE --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-yann-blue mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faLock} className="text-yann-cyan" />
                        Sécurité
                    </h2>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <FontAwesomeIcon icon={faLock} className="text-sm" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={password.current_password}
                                    onChange={(e) => setPassword({ ...password, current_password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <FontAwesomeIcon icon={faLock} className="text-sm" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={password.new_password}
                                    onChange={(e) => setPassword({ ...password, new_password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <FontAwesomeIcon icon={faLock} className="text-sm" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={password.new_password_confirmation}
                                    onChange={(e) => setPassword({ ...password, new_password_confirmation: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-sm text-yann-cyan hover:underline"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="mr-1" />
                                {showPassword ? 'Masquer' : 'Afficher'} les mots de passe
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isSavingPassword}
                            className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                                isSavingPassword
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-yann-cyan text-white hover:bg-cyan-600'
                            }`}
                        >
                            {isSavingPassword ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faLock} size="sm" />
                                    Changer le mot de passe
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* --- CARTE GESTION DES UTILISATEURS ADMIN (nouvelle) --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-yann-blue mb-4 flex items-center gap-2">
                        <FontAwesomeIcon icon={faUserPlus} className="text-yann-cyan" />
                        Gestion des utilisateurs admin
                    </h2>

                    {/* Liste des utilisateurs existants */}
                    <div className="mb-6 space-y-2">
                        {users.map((u) => (
                            <div
                                key={u.id}
                                className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-100"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {u.name}
                                        {u.id === user.id && (
                                            <span className="ml-2 text-xs font-normal text-yann-cyan">(vous)</span>
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500">{u.email}</p>
                                </div>
                                {u.id !== user.id && (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteUser(u.id)}
                                        disabled={deletingUserId === u.id}
                                        className="text-red-500 hover:text-red-600 disabled:opacity-50 p-2"
                                        title="Supprimer cet utilisateur"
                                    >
                                        {deletingUserId === u.id ? (
                                            <span className="block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <FontAwesomeIcon icon={faTrash} size="sm" />
                                        )}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Formulaire de création */}
                    <form onSubmit={handleCreateUser} className="space-y-4 pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">Ajouter un nouvel utilisateur</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Nom complet"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="email@exemple.com"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                                <input
                                    type={showNewUserPassword ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer</label>
                                <input
                                    type={showNewUserPassword ? 'text' : 'password'}
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yann-cyan outline-none"
                                    value={newUser.password_confirmation}
                                    onChange={(e) => setNewUser({ ...newUser, password_confirmation: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                            className="text-sm text-yann-cyan hover:underline"
                        >
                            <FontAwesomeIcon icon={showNewUserPassword ? faEyeSlash : faEye} className="mr-1" />
                            {showNewUserPassword ? 'Masquer' : 'Afficher'} les mots de passe
                        </button>

                        <button
                            type="submit"
                            disabled={isCreatingUser}
                            className={`w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                                isCreatingUser
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-yann-blue text-white hover:bg-blue-900'
                            }`}
                        >
                            {isCreatingUser ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faUserPlus} size="sm" />
                                    Créer l'utilisateur
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}