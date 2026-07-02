<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$orders = \App\Models\Order::all();
$invitations = \App\Models\Invitation::whereNotNull('order_id')->get(['id', 'title', 'order_id']);

echo "Total Orders: " . $orders->count() . "\n";
echo "Total Linked Invitations: " . $invitations->count() . "\n";
foreach($orders as $o) {
    $isLinked = $invitations->where('order_id', $o->id)->count() > 0;
    echo "Order #{$o->id} - {$o->customer_name}: " . ($isLinked ? "LINKED" : "UNLINKED") . "\n";
}
