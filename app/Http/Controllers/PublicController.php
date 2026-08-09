<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Resources\ProductCollection;


class PublicController extends Controller
{
    public function home(): Response
{
    // Récupère les 4 produits en promo
    $promoProducts = Product::where('is_promotional', true)
        ->with('category')
        ->take(4)
        ->get();

    // Récupère les 4 produits populaires
    $popularProducts = Product::where('is_popular', true)
        ->with('category')
        ->take(4)
        ->get();

    // Récupère toutes les catégories (avec leurs images)
    $categories = Category::all();

    return Inertia::render('welcome', [
        'promoProducts' => $promoProducts,
        'popularProducts' => $popularProducts,
        'categories' => $categories,
    ]);
}
    public function shop(Request $request): Response
{
    $categories = Category::all();

    // Requête de base
    $query = Product::with('category');

    // Filtre par catégorie
    if ($request->has('category') && $request->category !== 'all' && !empty($request->category)) {
        $query->where('category_id', $request->category);
    }

    // 🔍 Filtre par recherche (nom du produit)
    if ($request->has('search') && !empty($request->search)) {
        $searchTerm = $request->search;
        $query->where(function ($q) use ($searchTerm) {
            $q->where('name', 'like', "%{$searchTerm}%")
              ->orWhere('description', 'like', "%{$searchTerm}%");
        });
    }

    $products = $query->paginate(10);

    return Inertia::render('Shop', [
        'products' => $products,
        'categories' => $categories,
        'filters' => [
            'category' => $request->category ?? 'all',
            'search' => $request->search ?? null, // ← On renvoie le terme de recherche
        ],
    ]);
}
public function show($slug): Response
{
    $product = Product::where('slug', $slug)
        ->with(['media', 'category']) // <-- CORRIGÉ ICI (media au lieu de images)
        ->firstOrFail();

    return Inertia::render('product', [
        'product' => $product,
    ]);
}

public function category($slug): Response
{
    // Récupérer la catégorie
    $category = Category::where('slug', $slug)->firstOrFail();

    // Récupérer les produits de cette catégorie
    $products = Product::where('category_id', $category->id)
        ->with('category')
        ->get();

    // Récupérer les autres catégories (exclure la catégorie actuelle)
    $others = Category::where('slug', '!=', $slug)->get();

    return Inertia::render('Category', [
        'category' => $category,
        'products' => $products,
        'others' => $others,
    ]);
}

public function indexCart()
{
    return Inertia::render('cart');
}
}
