<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MboaSMSService
{
    public static function sendNewOrderSMS($order)
    {
        $apiKey = config('mboasms.api_key');
        $sender = config('mboasms.sender');
        $adminPhone = config('mboasms.admin_phone');

        // Format du message (160 caractères max)
        $message = "Nouvelle commande YannShop ! ";
        $message .= $order->customer_name . " (" . $order->customer_phone . ") ";
        $message .= $order->delivery_city . "-" . $order->delivery_neighborhood . " ";
        $message .= number_format($order->total_amount, 0, '', ' ') . " FCFA";

        // Envoi via MboaSMS API
        try {
            $response = Http::post('https://mboasms.com/api/send', [
                'api_key' => $apiKey,
                'sender' => $sender,
                'receiver' => $adminPhone,
                'message' => $message,
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            \Log::error('Erreur MboaSMS : ' . $e->getMessage());
            return false;
        }
    }
}
