<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Template;
use App\Models\Order;
use Faker\Factory as Faker;
use Carbon\Carbon;

$faker = Faker::create();
$templates = Template::all();

if ($templates->isEmpty()) {
    echo "No templates found\n";
    exit;
}

Order::truncate();

foreach ($templates as $template) {
    $numOrders = rand(5, 20);
    for ($i = 0; $i < $numOrders; $i++) {
        $qty = rand(1, 100);
        $price = $template->price * $qty;
        
        Order::create([
            'template_id' => $template->id,
            'customer_name' => $faker->name,
            'customer_phone' => $faker->phoneNumber,
            'quantity' => $qty,
            'total_price' => $price,
            'status' => 'completed',
            'created_at' => Carbon::now()->subDays(rand(1, 30)),
        ]);
    }
}

echo "Dummy orders seeded!\n";
