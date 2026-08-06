<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class InfobipService
{
    public static function sendNewOrderWhatsApp($order)
    {
        $baseUrl = trim((string) config('infobip.base_url'), '/');
        $apiKey = config('infobip.api_key');
        $sender = config('infobip.sender');
        $adminNumber = config('infobip.admin_whatsapp');

        if (!preg_match('#^https?://#i', $baseUrl) || !$apiKey || !$adminNumber) {
            \Log::error('Infobip WhatsApp : configuration invalide ou manquante', [
                'base_url' => $baseUrl,
                'api_key_present' => (bool) $apiKey,
                'admin_number_present' => (bool) $adminNumber,
            ]);
            return false;
        }

        $message = "🛒 *NOUVELLE COMMANDE YANNSHOP*\n\n";
        $message .= "👤 Client : " . $order->customer_name . "\n";
        $message .= "📞 Tél : " . $order->customer_phone . "\n\n";
        $message .= "📍 *ADRESSE DE LIVRAISON*\n";
        $message .= "🏙️ Ville : " . $order->delivery_city . "\n";
        $message .= "🏘️ Quartier : " . $order->delivery_neighborhood . "\n";
        $message .= "📍 Repère : " . ($order->delivery_landmark ?? 'Non précisé') . "\n\n";
        $message .= "💰 *MONTANT TOTAL* : " . number_format($order->total_amount, 0, '', ' ') . " FCFA\n";
        $message .= "📦 *STATUT* : En attente de traitement\n\n";
        $message .= "Connectez-vous au Dashboard Admin pour gérer cette commande.";

        try {
            // Endpoint correct pour un message texte WhatsApp (et non /whatsapp/1/messages)
            $url = $baseUrl . '/whatsapp/1/message/text';

            $payload = [
                'from' => $sender,
                'to' => $adminNumber,
                'messageId' => (string) Str::uuid(),
                'content' => [
                    'text' => $message,
                ],
            ];

            $response = Http::withHeaders([
                'Authorization' => 'App ' . $apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post($url, $payload);

            if (!$response->successful()) {
                \Log::error('Erreur Infobip WhatsApp : réponse API', [
                    'status' => $response->status(),
                    'body' => $response->json(),
                ]);
            }

            return $response->successful();
        } catch (\Exception $e) {
            \Log::error('Erreur Infobip WhatsApp : ' . $e->getMessage());
            return false;
        }
    }

    // Notification pour modification d'adresse
public static function sendClientModifiedOrderWhatsApp($order)
{
    $baseUrl = trim((string) config('infobip.base_url'), '/');
    $apiKey = config('infobip.api_key');
    $sender = config('infobip.sender');
    $adminNumber = config('infobip.admin_whatsapp');

    if (!$baseUrl || !$apiKey || !$adminNumber) return false;

    $message = "✏️ *MODIFICATION DE COMMANDE*\n\n";
    $message .= "📦 Commande : #" . $order->invoice_number . "\n";
    $message .= "👤 Client : " . $order->customer_name . "\n\n";
    $message .= "📍 *NOUVELLE ADRESSE :*\n";
    $message .= "🏙️ Ville : " . $order->delivery_city . "\n";
    $message .= "🏘️ Quartier : " . $order->delivery_neighborhood . "\n";
    $message .= "📍 Repère : " . ($order->delivery_landmark ?? 'Non précisé');

    try {
        $url = $baseUrl . '/whatsapp/1/message/text';
        $payload = [
            'from' => $sender,
            'to' => $adminNumber,
            'content' => ['text' => $message]
        ];
        Http::withHeaders([
            'Authorization' => 'App ' . $apiKey,
            'Content-Type' => 'application/json'
        ])->post($url, $payload);
        return true;
    } catch (\Exception $e) {
        \Log::error('Erreur Infobip Modification : ' . $e->getMessage());
        return false;
    }
}

// Notification pour annulation
public static function sendClientCancelledOrderWhatsApp($order)
{
    $baseUrl = trim((string) config('infobip.base_url'), '/');
    $apiKey = config('infobip.api_key');
    $sender = config('infobip.sender');
    $adminNumber = config('infobip.admin_whatsapp');

    if (!$baseUrl || !$apiKey || !$adminNumber) return false;

    $message = "❌ *COMMANDE ANNULÉE PAR LE CLIENT*\n\n";
    $message .= "📦 Commande : #" . $order->invoice_number . "\n";
    $message .= "👤 Client : " . $order->customer_name . "\n";
    $message .= "📞 Tél : " . $order->customer_phone . "\n\n";
    $message .= "Le client a annulé sa commande.";

    try {
        $url = $baseUrl . '/whatsapp/1/message/text';
        $payload = [
            'from' => $sender,
            'to' => $adminNumber,
            'content' => ['text' => $message]
        ];
        Http::withHeaders([
            'Authorization' => 'App ' . $apiKey,
            'Content-Type' => 'application/json'
        ])->post($url, $payload);
        return true;
    } catch (\Exception $e) {
        \Log::error('Erreur Infobip Annulation : ' . $e->getMessage());
        return false;
    }
}
// Notification pour un message de contact
public static function sendContactMessageWhatsApp($data)
{
    $baseUrl = trim((string) config('infobip.base_url'), '/');
    $apiKey = config('infobip.api_key');
    $sender = config('infobip.sender');
    $adminNumber = config('infobip.admin_whatsapp');

    if (!$baseUrl || !$apiKey || !$adminNumber) return false;

    $message = "📩 *NOUVEAU MESSAGE DE CONTACT*\n\n";
    $message .= "👤 Nom : " . $data['name'] . "\n";
    $message .= "📞 Téléphone : " . $data['phone'] . "\n";
    if (!empty($data['email'])) {
        $message .= "📧 Email : " . $data['email'] . "\n";
    }
    $message .= "📝 Sujet : " . $data['subject'] . "\n\n";
    $message .= "💬 Message :\n" . $data['message'];

    try {
        $url = $baseUrl . '/whatsapp/1/message/text';
        $payload = [
            'from' => $sender,
            'to' => $adminNumber,
            'content' => ['text' => $message]
        ];
        Http::withHeaders([
            'Authorization' => 'App ' . $apiKey,
            'Content-Type' => 'application/json'
        ])->post($url, $payload);
        return true;
    } catch (\Exception $e) {
        \Log::error('Erreur Infobip Contact : ' . $e->getMessage());
        return false;
    }
}
}
