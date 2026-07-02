<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$cashflows = App\Models\Cashflow::whereNull('category')->get();
foreach ($cashflows as $cf) {
    if ($cf->service_id) {
        $service = App\Models\Service::find($cf->service_id);
        if ($service) {
            $category = match ($service->slug) {
                'event-digital' => 'Digital',
                'cetak-fisik-premium' => 'Printing',
                'souvenir-merchandise' => 'Souvenir',
                default => 'Digital',
            };
            $cf->category = $category;
            $cf->save();
            echo "Updated Cashflow ID {$cf->id} to category: {$category}\n";
        }
    } elseif (strpos($cf->description, 'Pesanan Baru') !== false) {
        $cf->category = 'Digital'; // Default fallback
        $cf->save();
        echo "Updated Cashflow ID {$cf->id} to fallback category: Digital\n";
    }
}
echo "Done patching cashflows!\n";
