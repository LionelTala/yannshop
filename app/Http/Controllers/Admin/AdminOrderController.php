<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function getBadges()
    {
        $ordersCount = Order::where('status', 'en_attente')->count();
        $messagesCount = \App\Models\ContactMessage::where('is_read', false)->count();

        return response()->json([
            'orders' => $ordersCount,
            'messages' => $messagesCount,
        ]);
    }
}
