<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\DelivererController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ClientOrderController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', [PublicController::class, 'home'])->name('home');
Route::post('/logout', function () {
    Auth::logout();
    return redirect('/');
})->name('logout');
Route::get('/shop', [PublicController::class, 'shop'])->name('shop'); // <-- Ajoute ça
Route::get('/product/{slug}', [PublicController::class, 'show'])->name('product.show');
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'store']);
Route::get('/checkout/success/{id}', function($id) {
    return Inertia::render('checkout-success', ['orderId' => $id]);
})->name('checkout.success');

Route::get('/orders', [ClientOrderController::class, 'index'])->name('orders');
Route::post('/orders/search', [ClientOrderController::class, 'search']);
Route::put('/orders/{id}', [ClientOrderController::class, 'updateAddress']);
Route::delete('/orders/{id}', [ClientOrderController::class, 'cancel']);
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store']);

Route::match(['GET', 'POST'], '/' . config('app.admin_secret_path'), [AdminController::class, 'login'])->name('admin.login');

// 2. Dashboard protégé par le middleware 'admin'
Route::middleware(['admin'])->prefix(config('app.admin_secret_path'))->group(function () {
  Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/orders', [AdminController::class, 'orders'])->name('admin.orders');

    // API Badges (Pour la Sidebar)
    Route::get('/badges', [AdminController::class, 'getBadges']);

    // API Commandes (Pour la page Orders)
    Route::get('/orders/list', [AdminController::class, 'getOrdersList']);

    //category
    Route::get('/categories', [AdminController::class, 'categories']);

    Route::post('/categories', [AdminController::class, 'storeCategory']);
    Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
    Route::delete('/categories/{id}', [AdminController::class, 'deleteCategory']);

    Route::get('/products', [ProductController::class, 'index'])->name('admin.products');

    // CRUD Produits
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::get('/products/{id}', [ProductController::class, 'show'])->name('admin.products.show');

// Gestion des médias (depuis la page détail)
Route::post('/products/{id}/media', [ProductController::class, 'addMedia']);
Route::delete('/products/media/{mediaId}', [ProductController::class, 'deleteMedia']);

Route::get('/deliverers', [DelivererController::class, 'index'])->name('admin.deliverers');

// CRUD Livreurs
Route::post('/deliverers', [DelivererController::class, 'store']);
Route::put('/deliverers/{id}', [DelivererController::class, 'update']);
Route::delete('/deliverers/{id}', [DelivererController::class, 'destroy']);

Route::get('/orders', [OrderController::class, 'index'])->name('admin.orders');

// Actions
Route::post('/orders/{id}/assign', [OrderController::class, 'assign']);
Route::post('/orders/{id}/deliver', [OrderController::class, 'deliver']);

// Page Messages
Route::get('/messages', [AdminController::class, 'messages'])->name('admin.messages');

// Actions sur les messages
Route::post('/messages/{id}/read', [AdminController::class, 'markAsRead']);
Route::post('/messages/{id}/unread', [AdminController::class, 'markAsUnread']);
Route::delete('/messages/{id}', [AdminController::class, 'deleteMessage']);

// Page Mon Profil
Route::get('/profile', [AdminController::class, 'profile'])->name('admin.profile');

// Actions
Route::put('/profile', [AdminController::class, 'updateProfile']);
Route::put('/profile/password', [AdminController::class, 'updatePassword']);
});
