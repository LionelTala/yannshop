<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'customer_name',
        'customer_phone',
        'delivery_city',
        'delivery_neighborhood',
        'delivery_landmark',
        'delivery_details',
        'total_amount',
        'status',
        'deliverer_id',
    ];

    // Relation : Une commande peut être assignée à un livreur (nullable)
    public function deliverer()
    {
        return $this->belongsTo(Deliverer::class);
    }
    public function items()
{
    return $this->hasMany(OrderItem::class);
}

    // (Plus tard, on ajoutera une table order_items pour lier les produits aux commandes)
}
