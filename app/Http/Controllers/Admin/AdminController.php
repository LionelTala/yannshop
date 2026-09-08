<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Deliverer;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;

class AdminController extends Controller
{
    // === AUTHENTIFICATION ===

    public function login(Request $request)
    {
        if ($request->isMethod('post')) {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            $key = 'admin-login:' . $request->ip();
            if (RateLimiter::tooManyAttempts($key, 5)) {
                $seconds = RateLimiter::availableIn($key);
                return response()->json([
                    'message' => "Trop de tentatives. Veuillez attendre {$seconds} secondes.",
                    'retry_after' => $seconds
                ], 429);
            }

            if (Auth::attempt($request->only('email', 'password'))) {
                RateLimiter::clear($key);
                $request->session()->regenerate();
                return response()->json([
                    'success' => true,
                    'redirect' => route('admin.dashboard'),
                ]);
            }

            RateLimiter::hit($key, 300);
            return response()->json([
                'message' => 'Identifiants incorrects.',
            ], 401);
        }

        return Inertia::render('Admin/Login');
    }

    // === PAGES (Vues React) ===

    // 1. Dashboard (Récupère les données pour l'affichage)
    // === PAGES (Vues React) ===

public function dashboard()
{
    // --- Commandes ---
    $totalOrders = Order::count();
    $pendingOrders = Order::where('status', 'en_attente')->count();
    $deliveringOrders = Order::where('status', 'en_cours')->count();
    $deliveredOrders = Order::where('status', 'livré')->count();

    // --- Produits & Catégories ---
    $totalProducts = \App\Models\Product::count();
    $totalCategories = \App\Models\Category::count();

    // --- Messages ---
    $unreadMessages = \App\Models\ContactMessage::where('is_read', false)->count();

    // --- Visites (Simulé pour l'instant) ---
    $todayVisits = \App\Models\Visit::whereDate('created_at', now())->count();
    $totalVisits = \App\Models\Visit::count();

    // --- Dernières activités (Commandes récentes) ---
    $latestOrders = Order::with(['items.product', 'deliverer'])
        ->orderBy('created_at', 'desc')
        ->take(5)
        ->get();

    return Inertia::render('Admin/Dashboard', [
        'stats' => [
            // Commandes
            'orders_total' => $totalOrders,
            'orders_pending' => $pendingOrders,
            'orders_delivering' => $deliveringOrders,
            'orders_delivered' => $deliveredOrders,

            // E-Commerce
            'products_total' => $totalProducts,
            'categories_total' => $totalCategories,

            // Communication
            'messages_unread' => $unreadMessages,

            // Trafic
            'visits_today' => $todayVisits,
            'visits_total' => $totalVisits,
        ],
        'latestOrders' => $latestOrders,
    ]);
}

    // 2. Page Commandes (A venir)
    public function orders()
    {
        return Inertia::render('Admin/Orders');
    }

    // === API (Données pour React) ===

    // 1. API Badges (UNIQUEMENT pour la Sidebar)
    public function getBadges()
    {
        $ordersCount = Order::where('status', 'en_attente')->count();
        $messagesCount = ContactMessage::where('is_read', false)->count();

        return response()->json([
            'orders' => $ordersCount,
            'messages' => $messagesCount,
        ]);
    }

    // 2. API Liste complète des commandes (Pour la page Orders)
    public function getOrdersList()
    {
        $orders = Order::with(['items.product', 'deliverer'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['orders' => $orders]);
    }






    /// categorie crud
public function categories()
{
    // 1. Récupérer toutes les catégories
    $categories = \App\Models\Category::all();

    // 2. Renvoyer la vue avec les données
    return Inertia::render('Admin/Categories', [
        'categories' => $categories,
    ]);
}
// --- AJOUTER UNE CATÉGORIE ---
public function storeCategory(Request $request)
{
    try {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // 2MB max
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('uploads/categories', 'public');
        }

        $category = \App\Models\Category::create([
            'name' => $request->name,
            'slug' => \Illuminate\Support\Str::slug($request->name),
            'description' => $request->description,
            'image' => $imagePath,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Catégorie ajoutée avec succès !',
            'category' => $category,
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de l\'ajout : ' . $e->getMessage(),
        ], 500);
    }
}

// --- MODIFIER UNE CATÉGORIE ---
public function updateCategory(Request $request, $id)
{
    try {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $category = \App\Models\Category::findOrFail($id);

        $imagePath = $category->image;
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image si elle existe
            if ($category->image) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($category->image);
            }
            $imagePath = $request->file('image')->store('uploads/categories', 'public');
        }

        $category->update([
            'name' => $request->name,
            'slug' => \Illuminate\Support\Str::slug($request->name),
            'description' => $request->description,
            'image' => $imagePath,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Catégorie modifiée avec succès !',
            'category' => $category,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la modification : ' . $e->getMessage(),
        ], 500);
    }
}
// --- SUPPRIMER UNE CATÉGORIE ---
public function deleteCategory($id)
{
    try {
        $category = \App\Models\Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Catégorie supprimée avec succès.',
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la suppression : ' . $e->getMessage(),
        ], 500);
    }
}

// produit // === PAGE PRODUITS (TOUT-EN-UN) ===

public function products()
{
    // 1. Récupérer tous les produits avec leurs catégories
    $products = \App\Models\Product::with('category')->orderBy('created_at', 'desc')->get();

    // 2. Récupérer toutes les catégories pour le menu déroulant
    $categories = \App\Models\Category::all();

    // 3. Renvoyer la vue avec les données
    return Inertia::render('Admin/Products', [
        'products' => $products,
        'categories' => $categories,
    ]);
}

// === API CRUD POUR LES PRODUITS ===

public function storeProduct(Request $request)
{
    try {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'primary_image' => 'required|string',
        ]);

        $product = \App\Models\Product::create([
            'name' => $request->name,
            'slug' => \Illuminate\Support\Str::slug($request->name),
            'category_id' => $request->category_id,
            'description' => $request->description,
            'price' => $request->price,
            'primary_image' => $request->primary_image,
            'stock' => $request->stock ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produit ajouté avec succès !',
            'product' => $product,
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de l\'ajout : ' . $e->getMessage(),
        ], 500);
    }
}

public function updateProduct(Request $request, $id)
{
    try {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'primary_image' => 'required|string',
        ]);

        $product = \App\Models\Product::findOrFail($id);
        $product->update([
            'name' => $request->name,
            'slug' => \Illuminate\Support\Str::slug($request->name),
            'category_id' => $request->category_id,
            'description' => $request->description,
            'price' => $request->price,
            'primary_image' => $request->primary_image,
            'stock' => $request->stock ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produit modifié avec succès !',
            'product' => $product,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la modification : ' . $e->getMessage(),
        ], 500);
    }
}

public function deleteProduct($id)
{
    try {
        $product = \App\Models\Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé avec succès.',
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la suppression : ' . $e->getMessage(),
        ], 500);
    }
}
// === MÉDIAS (Images & Vidéos) ===

public function addProductMedia(Request $request, $productId)
{
    try {
        $request->validate([
            'type' => 'required|in:image,video',
            'url' => 'required|string',
            'order_rank' => 'nullable|integer',
        ]);

        \App\Models\ProductMedia::create([
            'product_id' => $productId,
            'type' => $request->type,
            'url' => $request->url,
            'order_rank' => $request->order_rank ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Média ajouté avec succès !',
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de l\'ajout du média : ' . $e->getMessage(),
        ], 500);
    }
}

public function deleteProductMedia($mediaId)
{
    try {
        $media = \App\Models\ProductMedia::findOrFail($mediaId);
        $media->delete();

        return response()->json([
            'success' => true,
            'message' => 'Média supprimé avec succès.',
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la suppression du média : ' . $e->getMessage(),
        ], 500);
    }
}



// === PAGE MESSAGES (Vue React) ===
public function messages()
{
    $messages = \App\Models\ContactMessage::orderBy('created_at', 'desc')->get();

    return Inertia::render('Admin/Messages', [
        'messages' => $messages,
    ]);
}

// === MARQUER COMME LU ===
public function markAsRead($id)
{
    $message = \App\Models\ContactMessage::findOrFail($id);
    $message->update(['is_read' => true]);

    return response()->json([
        'success' => true,
        'message' => 'Message marqué comme lu.',
    ]);
}

// === MARQUER COMME NON LU ===
public function markAsUnread($id)
{
    $message = \App\Models\ContactMessage::findOrFail($id);
    $message->update(['is_read' => false]);

    return response()->json([
        'success' => true,
        'message' => 'Message marqué comme non lu.',
    ]);
}
// === SUPPRIMER UN MESSAGE ===
public function deleteMessage($id)
{
    $message = \App\Models\ContactMessage::findOrFail($id);
    $message->delete();

    return response()->json([
        'success' => true,
        'message' => 'Message supprimé avec succès.',
    ]);
}



// === PAGE MON PROFIL (Vue React) ===
// Modifiée pour inclure la liste des utilisateurs admin existants
public function profile()
{
    $user = auth()->user();
    return Inertia::render('Admin/Profile', [
        'user' => $user,
        'users' => \App\Models\User::select('id', 'name', 'email')
            ->orderBy('name')
            ->get(),
    ]);
}

// === METTRE À JOUR LE PROFIL (Infos) ===
public function updateProfile(Request $request)
{
    $user = auth()->user();

    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email,' . $user->id,
    ]);

    $user->update([
        'name' => $request->name,
        'email' => $request->email,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Profil mis à jour avec succès !',
    ]);
}

// === CHANGER LE MOT DE PASSE ===
public function updatePassword(Request $request)
{
    $request->validate([
        'current_password' => 'required|current_password',
        'new_password' => 'required|string|min:8|confirmed',
    ]);

    auth()->user()->update([
        'password' => bcrypt($request->new_password),
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Mot de passe changé avec succès !',
    ]);
}

// === CRÉER UN NOUVEL UTILISATEUR ADMIN ===
public function storeUser(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email',
        'password' => 'required|string|min:8|confirmed',
    ]);

    $newUser = \App\Models\User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => bcrypt($validated['password']),
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Utilisateur créé avec succès !',
        'user' => [
            'id' => $newUser->id,
            'name' => $newUser->name,
            'email' => $newUser->email,
        ],
    ]);
}

// === SUPPRIMER UN UTILISATEUR ADMIN ===
// Bonus : sans ça, la gestion serait incomplète (on peut ajouter mais jamais retirer).
public function destroyUser($id)
{
    $currentUser = auth()->user();

    // Sécurité : on ne peut jamais se supprimer soi-même via cette route
    // (éviterait de se retrouver bloqué dehors sans autre admin pour se reconnecter).
    if ((int) $id === $currentUser->id) {
        return response()->json([
            'success' => false,
            'message' => 'Vous ne pouvez pas supprimer votre propre compte.',
        ], 422);
    }

    $user = \App\Models\User::findOrFail($id);
    $user->delete();

    return response()->json([
        'success' => true,
        'message' => 'Utilisateur supprimé avec succès.',
    ]);
}
}
