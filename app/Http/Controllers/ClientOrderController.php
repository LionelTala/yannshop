<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\InfobipService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientOrderController extends Controller
{
    // 1. Afficher la page de recherche
    public function index()
    {
        return Inertia::render('orders');
    }

    // 2. Rechercher les commandes par numéro
    public function search(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|max:20',
        ]);

        $orders = Order::with('items.product')
            ->where('customer_phone', $request->phone)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'orders' => $orders,
            'phone' => $request->phone,
        ]);
    }

    // 3. Modifier l'adresse
    public function updateAddress(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        // Vérification de sécurité
        if (!$order->can_be_modified) {
            return response()->json([
                'error' => 'Cette commande ne peut plus être modifiée, elle est déjà en cours de livraison.'
            ], 403);
        }

        $request->validate([
            'delivery_city' => 'required|string|max:100',
            'delivery_neighborhood' => 'required|string|max:255',
            'delivery_landmark' => 'nullable|string|max:255',
        ]);

        $order->update([
            'delivery_city' => $request->delivery_city,
            'delivery_neighborhood' => $request->delivery_neighborhood,
            'delivery_landmark' => $request->delivery_landmark,
        ]);

        // Notification Admin via ton InfobipService (juste pour l'info)
        InfobipService::sendClientModifiedOrderWhatsApp($order);

        return response()->json(['success' => true, 'order' => $order]);
    }

    // 4. Annuler la commande
    public function cancel($id)
    {
        $order = Order::findOrFail($id);

        if (!$order->can_be_modified) {
            return response()->json([
                'error' => 'Cette commande ne peut plus être annulée, elle est déjà en cours de livraison.'
            ], 403);
        }

        $order->update([
            'status' => 'annulé',
            'cancelled_at' => now(),
            'can_be_modified' => false,
        ]);

        // Notification Admin
        InfobipService::sendClientCancelledOrderWhatsApp($order);

        return response()->json(['success' => true]);
    }
}
