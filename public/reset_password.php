<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$email = 'nalarruang.id@gmail.com';
$user = User::where('email', $email)->first();

if ($user) {
    $user->password = Hash::make('password');
    $user->save();
    echo "SUCCESS: Password untuk {$email} berhasil direset menjadi 'password'\n";
} else {
    echo "ERROR: User {$email} tidak ditemukan.\n";
}
