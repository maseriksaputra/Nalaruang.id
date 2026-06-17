<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$services = \App\Models\Service::with(['templates' => function ($query) {
    $query->where('is_active', true)->orderBy('sort_order')->orderBy('price', 'asc');
}])->where('is_active', true)->orderBy('sort_order')->get();

$total = 0;
foreach($services as $s) {
    echo $s->title . ': ' . $s->templates->count() . PHP_EOL;
    $total += $s->templates->count();
}
echo "Total: " . $total . PHP_EOL;
