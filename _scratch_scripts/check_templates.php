<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$service = App\Models\Service::with(['categories.templates' => function($q) {
    $q->where('is_active', true)->orderBy('sort_order')->orderBy('price', 'asc');
}])->where('slug', 'cetak-fisik')->first();

if ($service && $service->categories->count() > 0) {
    echo "Category 0 templates: " . json_encode($service->categories[0]->templates) . "\n";
} else {
    echo "No categories\n";
}
