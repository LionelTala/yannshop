<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class EtechSMSService
{
    public static function sendNewOrderSMS($order)
    {
        // Récupère les identifiants depuis le fichier .env
        $login = config('etech.login');
        $apiKey = config('etech.api_key');
        $sender = config('etech.sender');
        $adminPhone = config('etech.admin_phone');

        // Construction du message (160 caractères max)
        $message = "Nouvelle commande YannShop ! ";
        $message .= $order->customer_name . " (" . $order->customer_phone . ") ";
        $message .= $order->delivery_city . "-" . $order->delivery_neighborhood . " ";
        $message .= number_format($order->total_amount, 0, '', ' ') . " FCFA";

        // Encodage du message pour l'URL (remplace les espaces par %20)
        $encodedMessage = urlencode($message);

        try {
            // Construction de l'URL complète avec les paramètres GET
            $url = "https://sms.etech-keys.com/api/send_sms.php?" . http_build_query([
                'login' => $login,
                'api_key' => $apiKey,
                'to' => $adminPhone,
                'from' => $sender,
                'text' => $message, // http_build_query encode automatiquement
                'dlrreq' => 1, // Activer l'accusé de réception
            ]);

            // Envoi de la requête GET
            $response = Http::get($url);

            // Si tu veux voir la réponse brute de l'API pour déboguer :
            // dd($response->body(), $response->status());

            return $response->successful();
        } catch (\Exception $e) {
            \Log::error('Erreur Etech SMS : ' . $e->getMessage());
            return false;
        }
    }
}
