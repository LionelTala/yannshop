<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
 use App\Services\InfobipService;
 use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function index()
    {
        return Inertia::render('checkout');
    }

    public function store(Request $request)
{
    $request->validate([
        'customer_name' => 'required|string|max:255',
        'customer_phone' => 'required|string|max:20',
        'delivery_city' => 'required|string|max:100',
        'delivery_neighborhood' => 'required|string|max:255',
        'delivery_landmark' => 'nullable|string|max:255',
        'total_amount' => 'required|numeric',
        'items' => 'required|array',
        'items.*.product_id' => 'required|exists:products,id',
        'items.*.quantity' => 'required|integer|min:1',
        'items.*.price' => 'required|numeric',
    ]);

    $order = Order::create([
        'invoice_number' => 'INV-' . Str::random(6),
        'customer_name' => $request->customer_name,
        'customer_phone' => $request->customer_phone,
        'delivery_city' => $request->delivery_city,
        'delivery_neighborhood' => $request->delivery_neighborhood,
        'delivery_landmark' => $request->delivery_landmark,
        'delivery_details' => '', // (Champ retiré du formulaire, on laisse vide)
        'total_amount' => $request->total_amount,
        'status' => 'en_attente',
    ]);

    // Enregistrer chaque produit dans order_items
    foreach ($request->items as $item) {
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $item['product_id'],
            'quantity' => $item['quantity'],
            'price' => $item['price'],
        ]);
    }
    InfobipService::sendNewOrderWhatsApp($order);
    return redirect()->route('checkout.success', ['id' => $order->id]);
}
}
