<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$template = \App\Models\Template::latest('id')->first();
if ($template) {
    \App\Models\Order::create([
        'template_id' => $template->id,
        'package_id' => $template->package_id ?? 1,
        'customer_name' => 'Tester Klien ' . rand(100, 999),
        'customer_phone' => '081234567890',
        'event_date' => now()->addDays(30),
        'quantity' => 1,
        'status' => 'pending',
        'total_price' => $template->price ?? 0,
    ]);
    echo "Success";
} else {
    echo "No template";
}
