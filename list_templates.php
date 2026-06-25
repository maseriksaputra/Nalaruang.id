<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$templates = App\Models\Template::all();
foreach ($templates as $t) {
    echo $t->name . " | demo_views: " . $t->demo_views . " | invitation_id: " . $t->invitation_id . "\n";
}
