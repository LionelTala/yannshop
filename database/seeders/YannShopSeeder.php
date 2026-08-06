<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\Deliverer;

class YannShopSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Créer des catégories
        $tech = Category::create([
            'name' => 'High-Tech',
            'slug' => 'high-tech',
            'description' => 'Les dernières technologies'
        ]);

        $fashion = Category::create([
            'name' => 'Mode & Accessoires',
            'slug' => 'mode-accessoires',
            'description' => 'Soyez élégant'
        ]);

        // 2. Créer des produits (High-Tech)
        Product::create([
            'category_id' => $tech->id,
            'name' => 'Samsung Galaxy S25 Ultra',
            'slug' => 'samsung-galaxy-s25-ultra',
            'description' => 'Le meilleur smartphone Android.',
            'price' => 950000,
            'stock' => 10,
            'promo_price' => 899000,
            'is_popular' => true,
            'is_promotional' => true,
            'primary_image' => 'https://via.placeholder.com/600x400/0F2B5B/ffffff?text=S25+Ultra'
        ]);

        Product::create([
            'category_id' => $tech->id,
            'name' => 'Casque Bluetooth Sony WH-1000XM5',
            'slug' => 'casque-sony-wh-1000xm5',
            'description' => 'Réduction de bruit exceptionnelle.',
            'price' => 250000,
            'stock' => 15,
            'promo_price' => null,
            'is_popular' => false,
            'is_promotional' => false,
            'primary_image' => 'https://via.placeholder.com/600x400/00B4D8/ffffff?text=Sony+WH-1000XM5'
        ]);

        // 3. Créer des produits (Mode)
        Product::create([
            'category_id' => $fashion->id,
            'name' => 'Sac à main Yann Signature',
            'slug' => 'sac-a-main-yann-signature',
            'description' => 'Élégance et qualité.',
            'price' => 85000,
            'stock' => 20,
            'promo_price' => 75000,
            'is_popular' => true,
            'is_promotional' => true,
            'primary_image' => 'https://via.placeholder.com/600x400/0F2B5B/ffffff?text=Sac+Yann'
        ]);

        // 4. Créer des livreurs
        Deliverer::create([
            'name' => 'Jean Paul',
            'phone' => '691234567',
            'city' => 'Douala',
            'is_active' => true,
            'delivery_count' => 0
        ]);

        Deliverer::create([
            'name' => 'Marie Claire',
            'phone' => '697654321',
            'city' => 'Yaoundé',
            'is_active' => true,
            'delivery_count' => 0
        ]);
    }
}
