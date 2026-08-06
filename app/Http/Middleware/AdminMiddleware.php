<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Pour l'instant, on utilise l'authentification par session de Breeze.
        // On vérifie simplement si l'utilisateur est connecté.
        if (!Auth::check()) {
            return redirect()->route('admin.login');
        }

        return $next($request);
    }
}
