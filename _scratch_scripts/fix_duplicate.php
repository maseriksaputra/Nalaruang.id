<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Service;

$services = Service::where('title', 'Cetak Fisik Premium')->get();
if ($services->count() > 1) {
    $services->last()->delete();
    echo "Deleted duplicate service\n";
} else {
    echo "No duplicate found\n";
}
