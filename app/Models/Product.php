<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'promo_price',
        'is_popular',
        'is_promotional',
        'primary_image',
    ];

    // Relation : Un produit appartient à une catégorie
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relation : Un produit a plusieurs images secondaires
    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('order_rank');
    }

    // Accesseur pour le prix (Si promo existe, on affiche le promo_price)
    public function getDisplayPriceAttribute()
    {
        if ($this->promo_price && $this->promo_price > 0) {
            return $this->promo_price;
        }
        return $this->price;
    }
    public function media()
{
    return $this->hasMany(ProductMedia::class)->orderBy('order_rank');
}
}
