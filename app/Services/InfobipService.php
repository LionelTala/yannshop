<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class InfobipService
{
    // Envoi d'un message à un seul numéro
    private static function sendWhatsAppMessage($to, $message)
    {
        $baseUrl = trim((string) config('infobip.base_url'), '/');
        $apiKey = config('infobip.api_key');
        $sender = config('infobip.sender');

        if (!preg_match('#^https?://#i', $baseUrl) || !$apiKey || !$to) {
            \Log::error('Infobip WhatsApp : configuration invalide ou manquante', [
                'base_url' => $baseUrl,
                'api_key_present' => (bool) $apiKey,
                'to' => $to,
            ]);
            return false;
        }

        try {
            $url = $baseUrl . '/whatsapp/1/message/text';

            $payload = [
                'from' => $sender,
                'to' => $to,
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

    // Envoi aux deux admins
    private static function sendToMultipleAdmins($message)
    {
        $admin1 = config('infobip.admin_whatsapp');
        $admin2 = config('infobip.admin_whatsapp_2');

        self::sendWhatsAppMessage($admin1, $message);
        if ($admin2) {
            self::sendWhatsAppMessage($admin2, $message);
        }
    }

    // Notification Nouvelle Commande (avec détails produits)
    public static function sendNewOrderWhatsApp($order)
    {
        $message = "*NOUVELLE COMMANDE YANNSHOP*\n\n";
        $message .= "Client : " . $order->customer_name . "\n";
        $message .= "Tel : " . $order->customer_phone . "\n\n";
        $message .= "*ADRESSE DE LIVRAISON*\n";
        $message .= "Ville : " . $order->delivery_city . "\n";
        $message .= "Quartier : " . $order->delivery_neighborhood . "\n";
        $message .= "Repere : " . ($order->delivery_landmark ?? 'Non precise') . "\n\n";

        $message .= "*PRODUITS COMMANDES*\n";
        foreach ($order->items as $index => $item) {
            $productName = $item->product->name ?? 'Produit #' . ($index + 1);
            $qty = $item->quantity;
            $unitPrice = $item->price;
            $subtotal = $qty * $unitPrice;
            $message .= "  " . ($index + 1) . ". " . $productName . " (x" . $qty . ") : " . number_format($subtotal, 0, '', ' ') . " FCFA\n";
        }

        $message .= "\n*MONTANT TOTAL* : " . number_format($order->total_amount, 0, '', ' ') . " FCFA\n";
        $message .= "*STATUT* : En attente de traitement\n\n";
        $message .= "Connectez-vous au Dashboard Admin pour gerer cette commande.";

        self::sendToMultipleAdmins($message);
    }

    // Notification Modification de commande
    public static function sendClientModifiedOrderWhatsApp($order)
    {
        $message = "*MODIFICATION DE COMMANDE*\n\n";
        $message .= "Commande : #" . $order->invoice_number . "\n";
        $message .= "Client : " . $order->customer_name . "\n\n";
        $message .= "*NOUVELLE ADRESSE*\n";
        $message .= "Ville : " . $order->delivery_city . "\n";
        $message .= "Quartier : " . $order->delivery_neighborhood . "\n";
        $message .= "Repere : " . ($order->delivery_landmark ?? 'Non precise');

        self::sendToMultipleAdmins($message);
    }

    // Notification Annulation de commande
    public static function sendClientCancelledOrderWhatsApp($order)
    {
        $message = "*COMMANDE ANNULEE PAR LE CLIENT*\n\n";
        $message .= "Commande : #" . $order->invoice_number . "\n";
        $message .= "Client : " . $order->customer_name . "\n";
        $message .= "Tel : " . $order->customer_phone . "\n\n";
        $message .= "Le client a annule sa commande.";

        self::sendToMultipleAdmins($message);
    }

    // Notification Message de contact
    public static function sendContactMessageWhatsApp($data)
    {
        $message = "*NOUVEAU MESSAGE DE CONTACT*\n\n";
        $message .= "Nom : " . $data['name'] . "\n";
        $message .= "Telephone : " . $data['phone'] . "\n";
        if (!empty($data['email'])) {
            $message .= "Email : " . $data['email'] . "\n";
        }
        $message .= "Sujet : " . $data['subject'] . "\n\n";
        $message .= "Message :\n" . $data['message'];

        self::sendToMultipleAdmins($message);
    }
}