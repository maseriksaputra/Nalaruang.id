<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Service;
use App\Models\Cashflow;
use App\Models\Order;
use Carbon\Carbon;
use Faker\Factory as Faker;

$faker = Faker::create();
$services = Service::all();

if ($services->isEmpty()) {
    echo "No services found\n";
    exit;
}

// Clear old cashflows
Cashflow::truncate();

foreach ($services as $service) {
    // Generate 30 days of data
    for ($i = 30; $i >= 0; $i--) {
        $date = Carbon::now()->subDays($i);
        
        // Income (1-5 orders per day)
        $numOrders = rand(1, 5);
        for ($j = 0; $j < $numOrders; $j++) {
            $amount = rand(50000, 500000);
            Cashflow::create([
                'service_id' => $service->id,
                'type' => 'income',
                'amount' => $amount,
                'description' => 'Pesanan Manual (Dummy)',
                'reference_type' => 'App\Models\Order',
                'reference_id' => rand(100, 999),
                'transaction_date' => $date->toDateString(),
            ]);
            
            // Also seed dummy Orders so Top Products can be tracked if we use Orders
            // For simplicity, let's just use Cashflows for total revenue
        }
        
        // Expense (0-2 expenses per day)
        if (rand(0, 100) > 60) {
            $amount = rand(20000, 200000);
            Cashflow::create([
                'service_id' => $service->id,
                'type' => 'expense',
                'amount' => $amount,
                'description' => 'Biaya Produksi / Operasional',
                'reference_type' => 'Manual',
                'transaction_date' => $date->toDateString(),
            ]);
        }
    }
}

echo "Cashflow data seeded!\n";
