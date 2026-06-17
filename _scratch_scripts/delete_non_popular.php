<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Service;

$services = Service::where('slug', 'cetak-fisik')->get();
foreach ($services as $s) {
    if (!$s->is_popular) {
        $s->delete();
        echo "Deleted service ID: " . $s->id . "\n";
    }
}
