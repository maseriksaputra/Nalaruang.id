<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $livewireManager = app('livewire');
    $component = $livewireManager->new('App\Filament\Resources\CashflowResource\Pages\ListCashflows');
    $resource = new App\Filament\Resources\CashflowResource();
    $table = $resource->table(new Filament\Tables\Table($component));
    echo 'Table created successfully!';
} catch (\Throwable $e) {
    echo $e->getMessage() . "\n" . $e->getTraceAsString();
}
