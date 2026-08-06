<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    // Autoriser l'enregistrement de ces colonnes en base de données
    protected $fillable = [
        'ip',
        'page',
    ];
}
