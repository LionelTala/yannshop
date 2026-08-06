<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique(); // Numéro de facture unique
            $table->string('customer_name');
            $table->string('customer_phone');

            // Adresse de livraison (En pavé)
            $table->string('delivery_city');      // Ville (Yaoundé / Douala)
            $table->string('delivery_neighborhood'); // Quartier
            $table->string('delivery_landmark')->nullable(); // Point de repère
            $table->text('delivery_details'); // Entrée en pavé, étage, etc.

            $table->decimal('total_amount', 10, 2);
            $table->string('status')->default('en_attente'); // en_attente, en_cours_livraison, livré, annulé

            // Livreur assigné (nullable car au début c'est vide)
            $table->foreignId('deliverer_id')->nullable()->constrained('deliverers')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
