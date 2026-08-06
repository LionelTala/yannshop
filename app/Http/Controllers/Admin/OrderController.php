<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Deliverer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    // === PAGE COMMANDES (Vue React) ===
    public function index()
    {
        $orders = Order::with(['items.product', 'deliverer'])
            ->orderBy('created_at', 'desc')
            ->get();

        $deliverers = Deliverer::where('is_active', true)->get();

        return Inertia::render('Admin/Orders', [
            'orders' => $orders,
            'deliverers' => $deliverers,
        ]);
    }

    // === ASSIGNER UN LIVREUR ===
    public function assign(Request $request, $id)
    {
        $request->validate([
            'deliverer_id' => 'required|exists:deliverers,id',
        ]);

        $order = Order::findOrFail($id);
        $order->update([
            'deliverer_id' => $request->deliverer_id,
            'status' => 'en_cours',
            'can_be_modified' => false,
        ]);

        // Génération du lien WhatsApp pré-rempli
        $deliverer = Deliverer::find($request->deliverer_id);
        $whatsappLink = $this->generateWhatsAppLink($order, $deliverer);

        return response()->json([
            'success' => true,
            'message' => 'Livreur assigné avec succès !',
            'whatsapp_link' => $whatsappLink,
        ]);
    }

    // === CHANGER LE STATUT (Livré) ===
    public function deliver($id)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => 'livré']);

        return response()->json([
            'success' => true,
            'message' => 'Commande marquée comme livrée.',
        ]);
    }

    // === GÉNÉRATION DU LIEN WHATSAPP ===
    private function generateWhatsAppLink($order, $deliverer)
    {
        $message = "🏪 *YANNSHOP - Nouvelle course*\n\n";
        $message .= "👤 Client : " . $order->customer_name . "\n";
        $message .= "📞 Tél : " . $order->customer_phone . "\n\n";
        $message .= "📍 *ADRESSE DE LIVRAISON*\n";
        $message .= "Ville : " . $order->delivery_city . "\n";
        $message .= "Quartier : " . $order->delivery_neighborhood . "\n";
        $message .= "Repère : " . ($order->delivery_landmark ?? 'Non précisé') . "\n\n";
        $message .= "📦 *PRODUITS*\n";
        foreach ($order->items as $item) {
            $message .= "- " . $item->product->name . " (x" . $item->quantity . ")\n";
        }
        $message .= "\n💰 *MONTANT* : " . number_format($order->total_amount, 0, '', ' ') . " FCFA";

        $encoded = urlencode($message);
        return "https://wa.me/" . $deliverer->phone . "?text=" . $encoded;
    }
}
