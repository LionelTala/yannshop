<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class InfobipService
{
    // --- Fonction privée pour envoyer un message à un seul numéro ---
    private static function sendWhatsAppMessage($to, $message): bool
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

    // --- Envoi aux deux admins ---
    // Retourne true si AU MOINS un envoi a réussi, pour que l'appelant sache
    // si la notification est passée ou totalement silencieuse.
    private static function sendToMultipleAdmins($message): bool
    {
        $admin1 = config('infobip.admin_whatsapp');
        $admin2 = config('infobip.admin_whatsapp_2');

        $success1 = self::sendWhatsAppMessage($admin1, $message);
        $success2 = $admin2 ? self::sendWhatsAppMessage($admin2, $message) : false;

        return $success1 || $success2;
    }

    // --- Notification Nouvelle Commande (avec détails produits) ---
    public static function sendNewOrderWhatsApp($order): bool
    {
        $message = "🛒 *NOUVELLE COMMANDE YANNSHOP*\n\n";
        $message .= "👤 Client : " . $order->customer_name . "\n";
        $message .= "📞 Tél : " . $order->customer_phone . "\n\n";
        $message .= "📍 *ADRESSE DE LIVRAISON*\n";
        $message .= "🏙️ Ville : " . $order->delivery_city . "\n";
        $message .= "🏘️ Quartier : " . $order->delivery_neighborhood . "\n";
        $message .= "📍 Repère : " . ($order->delivery_landmark ?? 'Non précisé') . "\n\n";

        // Détail des produits commandés
        $message .= "📦 *PRODUITS COMMANDÉS*\n";
        foreach ($order->items as $index => $item) {
            $productName = $item->product->name ?? 'Produit #' . ($index + 1);
            $qty = $item->quantity;
            $unitPrice = $item->price;
            $subtotal = $qty * $unitPrice;
            // Le numéro est calculé AVANT l'interpolation : {$index + 1} directement
            // dans la chaîne est une erreur de syntaxe PHP (la syntaxe {$...} n'accepte
            // que des accès variable/propriété/tableau, pas d'opérations arithmétiques).
            $number = $index + 1;
            $message .= "  {$number}. {$productName} (x{$qty}) : " . number_format($subtotal, 0, '', ' ') . " FCFA\n";
        }

        $message .= "\n💰 *MONTANT TOTAL* : " . number_format($order->total_amount, 0, '', ' ') . " FCFA\n";
        $message .= "📦 *STATUT* : En attente de traitement\n\n";
        $message .= "Connectez-vous au Dashboard Admin pour gérer cette commande.";

        return self::sendToMultipleAdmins($message);
    }

    // --- Notification Modification de commande ---
    public static function sendClientModifiedOrderWhatsApp($order): bool
    {
        $message = "✏️ *MODIFICATION DE COMMANDE*\n\n";
        $message .= "📦 Commande : #" . $order->invoice_number . "\n";
        $message .= "👤 Client : " . $order->customer_name . "\n\n";
        $message .= "📍 *NOUVELLE ADRESSE :*\n";
        $message .= "🏙️ Ville : " . $order->delivery_city . "\n";
        $message .= "🏘️ Quartier : " . $order->delivery_neighborhood . "\n";
        $message .= "📍 Repère : " . ($order->delivery_landmark ?? 'Non précisé');

        return self::sendToMultipleAdmins($message);
    }

    // --- Notification Annulation de commande ---
    public static function sendClientCancelledOrderWhatsApp($order): bool
    {
        $message = "❌ *COMMANDE ANNULÉE PAR LE CLIENT*\n\n";
        $message .= "📦 Commande : #" . $order->invoice_number . "\n";
        $message .= "👤 Client : " . $order->customer_name . "\n";
        $message .= "📞 Tél : " . $order->customer_phone . "\n\n";
        $message .= "Le client a annulé sa commande.";

        return self::sendToMultipleAdmins($message);
    }

    // --- Notification Message de contact ---
    public static function sendContactMessageWhatsApp($data): bool
    {
        $message = "📩 *NOUVEAU MESSAGE DE CONTACT*\n\n";
        $message .= "👤 Nom : " . $data['name'] . "\n";
        $message .= "📞 Téléphone : " . $data['phone'] . "\n";
        if (!empty($data['email'])) {
            $message .= "📧 Email : " . $data['email'] . "\n";
        }
        $message .= "📝 Sujet : " . $data['subject'] . "\n\n";
        $message .= "💬 Message :\n" . $data['message'];

        return self::sendToMultipleAdmins($message);
    }
}
