<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'image_path',
        'order_rank',
    ];

    // Relation : L'image appartient à un produit
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
