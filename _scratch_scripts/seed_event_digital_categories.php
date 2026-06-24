<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$s = \App\Models\Service::find(1);
if($s) {
    $cats = ['Undangan Digital', 'Video Undangan Cinematic', 'Buku Tamu Digital (QR Code)', 'RSVP & Filter Instagram Acara'];
    foreach($cats as $c) {
        \App\Models\Category::firstOrCreate(['service_id' => 1, 'name' => $c, 'slug' => \Illuminate\Support\Str::slug($c)]);
    }
    echo "Categories added\n";
} else {
    echo "Service not found\n";
}
