<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Mr Shelby',
            'email' => 'lioneltala93230@gmail.com',
            'password' => Hash::make('lioneltala'),
            'email_verified_at' => now(),
        ]);
    }
}
