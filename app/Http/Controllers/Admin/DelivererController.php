<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Deliverer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class DelivererController extends Controller
{
    // === PAGE LIVREURS (Affiche la vue avec les données) ===
    public function index()
    {
        $deliverers = Deliverer::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Deliverers', [
            'deliverers' => $deliverers,
        ]);
    }

    // === AJOUTER UN LIVREUR ===
    public function store(Request $request)
    {
        // Validation ultra-sécurisée
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:deliverers,phone',
            'city' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $deliverer = Deliverer::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'city' => $request->city,
                'is_active' => true,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Livreur ajouté avec succès !',
                'deliverer' => $deliverer,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur lors de l\'ajout.',
            ], 500);
        }
    }

    // === MODIFIER UN LIVREUR ===
    public function update(Request $request, $id)
    {
        $deliverer = Deliverer::find($id);

        if (!$deliverer) {
            return response()->json([
                'success' => false,
                'message' => 'Livreur introuvable.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:deliverers,phone,' . $id,
            'city' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $deliverer->update([
                'name' => $request->name,
                'phone' => $request->phone,
                'city' => $request->city,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Livreur modifié avec succès !',
                'deliverer' => $deliverer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur lors de la modification.',
            ], 500);
        }
    }

    // === SUPPRIMER UN LIVREUR ===
    public function destroy($id)
    {
        $deliverer = Deliverer::find($id);

        if (!$deliverer) {
            return response()->json([
                'success' => false,
                'message' => 'Livreur introuvable.',
            ], 404);
        }

        try {
            $deliverer->delete();

            return response()->json([
                'success' => true,
                'message' => 'Livreur supprimé avec succès.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur lors de la suppression.',
            ], 500);
        }
    }
}
