<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Category;

Category::where('slug', 'buku-yasin')->update(['form_type' => 'yasin']);
echo "Updated Yasin form_type\n";
