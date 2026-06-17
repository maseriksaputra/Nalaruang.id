<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- TEMPLATES ---\n";
$t = \App\Models\Template::all();
foreach($t as $template) {
    echo "Template ID: " . $template->id . " Name: " . $template->name . "\n";
}

echo "\n--- INVITATIONS (is_template = 0) ---\n";
$i = \App\Models\Invitation::where('is_template', false)->get();
foreach($i as $inv) {
    echo "Project ID: " . $inv->id . " Title: " . $inv->title . "\n";
}

echo "\n--- INVITATIONS (is_template = 1) ---\n";
$i2 = \App\Models\Invitation::where('is_template', true)->get();
foreach($i2 as $inv) {
    echo "Template ID: " . $inv->id . " Title: " . $inv->title . "\n";
}
