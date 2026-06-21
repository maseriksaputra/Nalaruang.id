<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$inv = App\Models\Invitation::find(2);
$config = $inv->canvas_config;

file_put_contents(__DIR__.'/debug_output.json', json_encode($config, JSON_PRETTY_PRINT));
echo "Saved to debug_output.json\n";
