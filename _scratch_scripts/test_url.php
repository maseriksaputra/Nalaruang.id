<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "APP_URL from config: " . config('app.url') . "\n";
echo "Storage public URL: " . Illuminate\Support\Facades\Storage::disk('public')->url('templates/test.jpg') . "\n";
