<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

if (!User::where('email', 'admin@admin.com')->exists()) {
    User::create([
        'name' => 'Admin',
        'email' => 'admin@admin.com',
        'password' => bcrypt('password')
    ]);
    echo "Admin created.\n";
} else {
    echo "Admin already exists.\n";
}
