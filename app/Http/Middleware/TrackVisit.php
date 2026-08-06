<?php

namespace App\Http\Middleware;

use App\Models\Visit;
use Closure;
use Illuminate\Http\Request;

class TrackVisit
{
    public function handle(Request $request, Closure $next)
    {
        // Récupérer l'adresse IP du visiteur
        $ip = $request->ip();

        // Vérifier si cette IP a déjà été enregistrée aujourd'hui
        $existingVisit = Visit::where('ip', $ip)
            ->whereDate('created_at', today())
            ->first();

        // Si aucune visite n'a été enregistrée pour cette IP aujourd'hui, on enregistre
        if (!$existingVisit) {
            Visit::create([
                'ip' => $ip,
                'page' => $request->path(),
            ]);
        }

        return $next($request);
    }
}
