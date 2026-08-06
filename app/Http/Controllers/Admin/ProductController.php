<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    // === PAGE PRODUITS ===
    public function index()
    {
        $products = Product::with('category')->orderBy('created_at', 'desc')->get();
        $categories = \App\Models\Category::all();

        return Inertia::render('Admin/Products', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    // === AJOUTER UN PRODUIT (AVEC UPLOAD) ===
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'promo_price' => 'nullable|numeric',
            'stock' => 'required|integer|min:0',
            'is_popular' => 'nullable|boolean',
            'is_promotional' => 'nullable|boolean',
            'primary_image' => 'required|image|max:5120', // 5MB max
            'media' => 'nullable|array',
            'media.*.file' => 'required|file|max:20480', // 20MB max
            'media.*.type' => 'required|in:image,video',
        ]);

        // 1. Upload de l'image principale
        $primaryPath = $request->file('primary_image')->store('uploads/products', 'public');

        // 2. Créer le produit
        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'category_id' => $request->category_id,
            'description' => $request->description,
            'price' => $request->price,
            'promo_price' => $request->promo_price ?? null,
            'stock' => $request->stock,
            'is_popular' => $request->boolean('is_popular'),
            'is_promotional' => $request->boolean('is_promotional'),
            'primary_image' => $primaryPath,
        ]);

        // 3. Upload des médias secondaires
        if ($request->has('media') && is_array($request->media)) {
            foreach ($request->media as $mediaItem) {
                $file = $mediaItem['file'];
                $path = $file->store('uploads/products/media', 'public');

                ProductMedia::create([
                    'product_id' => $product->id,
                    'type' => $mediaItem['type'],
                    'url' => $path,
                    'order_rank' => $mediaItem['order_rank'] ?? 0,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Produit ajouté avec succès !',
            'product' => $product,
        ]);
    }

    // === MODIFIER UN PRODUIT ===
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'promo_price' => 'nullable|numeric',
            'stock' => 'required|integer|min:0',
            'is_popular' => 'nullable|boolean',
            'is_promotional' => 'nullable|boolean',
        ]);

        // Gestion de l'image principale (si nouvelle image uploadée)
        $primaryPath = $product->primary_image;
        if ($request->hasFile('primary_image')) {
            Storage::disk('public')->delete($product->primary_image);
            $primaryPath = $request->file('primary_image')->store('uploads/products', 'public');
        }

        $product->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'category_id' => $request->category_id,
            'description' => $request->description,
            'price' => $request->price,
            'promo_price' => $request->promo_price ?? null,
            'stock' => $request->stock,
            'is_popular' => $request->boolean('is_popular'),
            'is_promotional' => $request->boolean('is_promotional'),
            'primary_image' => $primaryPath,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produit modifié avec succès !',
        ]);
    }

    // === SUPPRIMER UN PRODUIT ===
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Supprimer l'image principale
        Storage::disk('public')->delete($product->primary_image);

        // Supprimer les médias secondaires
        foreach ($product->media as $media) {
            Storage::disk('public')->delete($media->url);
        }
        $product->media()->delete();

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé avec succès.',
        ]);
    }

    // === PAGE DÉTAIL PRODUIT ===
    public function show($id)
    {
        $product = Product::with(['category', 'media'])->findOrFail($id);
        $categories = \App\Models\Category::all();

        return Inertia::render('Admin/ProductDetail', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    // === AJOUTER UN MÉDIA (depuis la page détail) ===
    public function addMedia(Request $request, $id)
    {
        $request->validate([
            'type' => 'required|in:image,video',
            'file' => 'required|file|max:20480', // 20MB max
            'order_rank' => 'nullable|integer',
        ]);

        $path = $request->file('file')->store('uploads/products/media', 'public');

        ProductMedia::create([
            'product_id' => $id,
            'type' => $request->type,
            'url' => $path,
            'order_rank' => $request->order_rank ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Média ajouté avec succès !',
        ]);
    }

    // === SUPPRIMER UN MÉDIA (depuis la page détail) ===
    public function deleteMedia($mediaId)
    {
        $media = ProductMedia::findOrFail($mediaId);

        Storage::disk('public')->delete($media->url);
        $media->delete();

        return response()->json([
            'success' => true,
            'message' => 'Média supprimé avec succès.',
        ]);
    }
}
