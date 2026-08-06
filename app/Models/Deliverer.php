<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deliverer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'city',
        'is_active',
        'delivery_count',
    ];

    // Relation : Un livreur peut avoir plusieurs commandes assignées
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
