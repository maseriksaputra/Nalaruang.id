<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$admin = User::firstOrCreate(
    ['email' => 'admin@kreatifprint.com'],
    [
        'name' => 'Super Admin',
        'password' => Hash::make('password'),
    ]
);

echo "Admin user created: admin@kreatifprint.com / password\n";
