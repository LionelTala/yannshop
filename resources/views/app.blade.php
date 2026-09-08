<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" translate="no" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        {{-- Réduit la latence de connexion vers le CDN Font Awesome --}}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            {{-- Filet de sécurité : si une page oublie son propre <Head>,
                 on affiche ceci plutôt qu'un titre/description vides ou "Laravel". --}}
            <title>{{ config('app.name', 'YannShop') }} - Boutique en ligne à Yaoundé et Douala</title>
            <meta name="description" content="YannShop, votre boutique en ligne à Yaoundé et Douala. Livraison rapide, paiement à la livraison.">
            <meta property="og:site_name" content="{{ config('app.name', 'YannShop') }}">
            <meta property="og:locale" content="fr_FR">
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
