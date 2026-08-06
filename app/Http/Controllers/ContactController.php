<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Services\InfobipService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    // Afficher la page contact
    public function index()
    {
        // Données dynamiques (à stocker plus tard dans la base de données)
        $contacts = [
            'phone' => config('app.admin_phone', '237691234567'),
            'whatsapp' => config('app.admin_whatsapp', '237691234567'),
            'email' => config('app.admin_email', 'contact@yannshop.cm'),
        ];

        return Inertia::render('contact', [
            'contacts' => $contacts,
        ]);
    }

    // Envoyer le message
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Sauvegarder en base
        ContactMessage::create($request->all());

        // Envoyer une notification WhatsApp à l'Admin
        InfobipService::sendContactMessageWhatsApp($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Votre message a été envoyé avec succès !',
        ]);
    }
}
