<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Template;
use App\Models\Order;
use App\Models\Cashflow;
use App\Models\Service;
use App\Models\Package;
use Faker\Factory as Faker;
use Carbon\Carbon;

echo "Menyiapkan Data Dummy untuk Dashboard Admin...\n";

$faker = Faker::create('id_ID');

// Cek apakah ada layanan, jika tidak buat satu
$service = Service::first();
if (!$service) {
    $service = Service::create([
        'name' => 'Undangan Website',
        'slug' => 'undangan-website',
        'description' => 'Layanan pembuatan undangan website',
        'is_active' => true,
    ]);
}

// Cek apakah ada paket
$package = Package::first();
if (!$package) {
    $package = Package::create([
        'service_id' => $service->id,
        'name' => 'Premium Package',
        'slug' => 'premium',
        'price' => 150000,
        'is_active' => true,
    ]);
}

// Cek apakah ada template
$template = Template::first();
if (!$template) {
    $template = Template::create([
        'service_id' => $service->id,
        'name' => 'Elegant Floral',
        'slug' => 'elegant-floral',
        'price' => 50000,
        'is_active' => true,
    ]);
}

// Bersihkan data lama agar chart bersih
echo "Membersihkan data lama...\n";
Order::truncate();
Cashflow::truncate();

echo "Membuat 150 Order & Cashflow dalam 6 bulan terakhir...\n";

$templates = Template::all();
$packages = Package::all();
$services = Service::all();

$expenseDescriptions = ['Biaya Iklan Facebook', 'Biaya Hosting Bulanan', 'Beli Aset Premium', 'Gaji Freelancer', 'Operasional Internet'];

for ($i = 0; $i < 150; $i++) {
    $t = $templates->random();
    $p = $packages->random();
    
    $qty = rand(1, 2);
    // Harga gabungan template + package * qty
    $tPrice = (float)($t->price ?? 0);
    $pPrice = (float)($p->price ?? 0);
    $price = ($tPrice + $pPrice) * $qty;
    
    // Pastikan harga setidaknya ada nilainya untuk data visual
    if ($price == 0) $price = rand(50, 300) * 1000;
    
    // Distribusi tanggal lebih banyak di bulan terbaru
    $daysAgo = rand(0, 180);
    // Sedikit trik agar bulan ini lebih banyak order
    if (rand(1, 100) > 60) {
        $daysAgo = rand(0, 30); 
    }
    
    $date = Carbon::now()->subDays($daysAgo);
    
    // Buat Order
    $order = Order::create([
        'template_id' => $t->id,
        'package_id' => $p->id,
        'customer_name' => $faker->name,
        'customer_phone' => $faker->phoneNumber,
        'event_date' => (clone $date)->addDays(rand(14, 60)),
        'quantity' => $qty,
        'status' => 'completed',
        'total_price' => $price,
        'created_at' => $date,
        'updated_at' => $date,
    ]);
    
    // Buat Cashflow Income (Terkoneksi ke Order)
    Cashflow::create([
        'service_id' => $t->service_id ?? clone $services->random()->id,
        'type' => 'income',
        'amount' => $price,
        'description' => 'Pembayaran Order #' . $order->id . ' - ' . $faker->firstName,
        'reference_type' => 'App\Models\Order',
        'reference_id' => $order->id,
        'transaction_date' => $date,
        'created_at' => $date,
        'updated_at' => $date,
    ]);
    
    // Sesekali buat Cashflow Expense (Pengeluaran)
    if (rand(1, 10) > 7) {
        Cashflow::create([
            'service_id' => $services->random()->id,
            'type' => 'expense',
            'amount' => rand(50, 500) * 1000,
            'description' => $expenseDescriptions[array_rand($expenseDescriptions)],
            'transaction_date' => $date,
            'created_at' => $date,
            'updated_at' => $date,
        ]);
    }
}

echo "Berhasil! Data dummy Dashboard siap!\n";
