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
        // Récupère les 4 produits populaires
        $popularProducts = Product::where('is_popular', true)
            ->with('category')
            ->take(4)
            ->get();

        // Récupère les 4 produits en promo
        $promoProducts = Product::where('is_promotional', true)
            ->with('category')
            ->take(4)
            ->get();

        return Inertia::render('welcome', [
            'popularProducts' => $popularProducts,
            'promoProducts' => $promoProducts,
        ]);
    }
    public function shop(Request $request): Response
    {
        // Récupérer toutes les catégories pour le menu de tri
        $categories = Category::all();

        // Construire la requête des produits
        $query = Product::with('category');

        // Filtre par catégorie (si l'utilisateur a cliqué sur une catégorie)
        if ($request->has('category') && $request->category != 'all') {
            $query->where('category_id', $request->category);
        }

        // Récupérer les produits (paginetés par 12 pour ne pas surcharger la page)
        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('Shop', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'category' => $request->category ?? 'all',
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
}
