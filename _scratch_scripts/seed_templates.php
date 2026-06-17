<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Service;
use App\Models\Package;
use App\Models\Template;

Template::truncate();

$digitalService = Service::where('slug', 'event-digital')->first();

if ($digitalService) {
    // Packages
    $basic = Package::where('service_id', $digitalService->id)->where('name', 'Basic')->first();
    $standard = Package::where('service_id', $digitalService->id)->where('name', 'Standard')->first();
    $premium = Package::where('service_id', $digitalService->id)->where('name', 'Premium')->first();
    $vip = Package::where('service_id', $digitalService->id)->where('name', 'Custom VIP')->first();

    // Basic Templates
    Template::create(['service_id' => $digitalService->id, 'package_id' => $basic->id, 'name' => 'Minimalist White', 'category' => 'Simple', 'price' => 20000]);
    Template::create(['service_id' => $digitalService->id, 'package_id' => $basic->id, 'name' => 'Rustic Brown', 'category' => 'Simple', 'price' => 20000]);

    // Standard Templates
    Template::create(['service_id' => $digitalService->id, 'package_id' => $standard->id, 'name' => 'Elegant Gold', 'category' => 'Animasi', 'price' => 50000]);
    Template::create(['service_id' => $digitalService->id, 'package_id' => $standard->id, 'name' => 'Floral Spring', 'category' => 'Animasi', 'price' => 50000]);

    // Premium Templates
    Template::create(['service_id' => $digitalService->id, 'package_id' => $premium->id, 'name' => 'Luxury Emerald', 'category' => 'Premium', 'price' => 80000, 'sort_order' => 1]);
    Template::create(['service_id' => $digitalService->id, 'package_id' => $premium->id, 'name' => 'Modern Monotone', 'category' => 'Premium', 'price' => 80000, 'sort_order' => 2]);
    
    // VIP
    Template::create(['service_id' => $digitalService->id, 'package_id' => $vip->id, 'name' => 'Royal Custom', 'category' => 'VIP', 'price' => 120000, 'sort_order' => 3]);

    echo "Templates seeded successfully!\n";
} else {
    echo "Digital Service not found!\n";
}
