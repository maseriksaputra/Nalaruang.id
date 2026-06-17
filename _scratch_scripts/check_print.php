<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$t = App\Models\Template::with('category')->where('name', 'Print Hitam Putih A4')->first();
echo "Form Type: " . ($t->category ? $t->category->form_type : 'null') . "\n";
