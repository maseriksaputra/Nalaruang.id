<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$orders = \App\Models\Order::with('template:id,name,image,preview_url')->orderBy('created_at', 'desc')->get();
echo json_encode($orders, JSON_PRETTY_PRINT);
