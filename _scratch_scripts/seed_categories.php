<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Service;
use App\Models\Category;
use App\Models\Template;
use Illuminate\Support\Str;

$cetakFisik = Service::where('slug', 'cetak-fisik')->first();
if (!$cetakFisik) {
    $cetakFisik = Service::create([
        'title' => 'Cetak Fisik Premium',
        'slug' => 'cetak-fisik',
        'description' => 'Layanan cetak dokumen, undangan, dan merchandise berkualitas premium.',
        'is_popular' => true,
        'features' => ['Undangan Pernikahan Eksklusif', 'Custom Lanyard & ID Card', 'Buku Yasin Premium', 'Print & Fotocopy Dokumen'],
    ]);
}

// Clear old categories for this service just in case
Category::where('service_id', $cetakFisik->id)->delete();

// Create Categories
$catUndangan = Category::create([
    'service_id' => $cetakFisik->id,
    'name' => 'Undangan Fisik',
    'slug' => 'undangan-fisik',
    'description' => 'Berbagai macam undangan cetak untuk pernikahan, khitanan, dan acara lainnya.',
    'form_type' => 'undangan',
]);

$catYasin = Category::create([
    'service_id' => $cetakFisik->id,
    'name' => 'Buku Yasin & Majmu',
    'slug' => 'buku-yasin',
    'description' => 'Buku Yasin custom dengan kualitas premium.',
    'form_type' => 'yasin', // uses specialized form
]);

$catLanyard = Category::create([
    'service_id' => $cetakFisik->id,
    'name' => 'Lanyard & ID Card',
    'slug' => 'lanyard-id-card',
    'description' => 'Tali Lanyard custom dan pencetakan ID Card perusahaan.',
    'form_type' => 'lanyard',
]);

$catPrint = Category::create([
    'service_id' => $cetakFisik->id,
    'name' => 'Print & Fotocopy',
    'slug' => 'print-fotocopy',
    'description' => 'Jasa cetak dokumen, skripsi, dan fotocopy.',
    'form_type' => 'print',
]);

// Add some Templates (Products) for Undangan Fisik
Template::create([
    'service_id' => $cetakFisik->id,
    'category_id' => $catUndangan->id,
    'name' => 'Undangan Nikah Hardcover',
    'category' => 'Nikah',
    'price' => 15000,
]);
Template::create([
    'service_id' => $cetakFisik->id,
    'category_id' => $catUndangan->id,
    'name' => 'Undangan Khitanan Softcover',
    'category' => 'Khitanan',
    'price' => 5000,
]);

// Add Templates for Buku Yasin
Template::create([
    'service_id' => $cetakFisik->id,
    'category_id' => $catYasin->id,
    'name' => 'Yasin Bludru Premium',
    'category' => 'Yasin',
    'price' => 35000,
]);
Template::create([
    'service_id' => $cetakFisik->id,
    'category_id' => $catYasin->id,
    'name' => 'Yasin Softcover Standard',
    'category' => 'Yasin',
    'price' => 15000,
]);

// Add Templates for Lanyard
Template::create([
    'service_id' => $cetakFisik->id,
    'category_id' => $catLanyard->id,
    'name' => 'Lanyard Print 2 Sisi (Saja)',
    'category' => 'Lanyard',
    'price' => 15000,
]);
Template::create([
    'service_id' => $cetakFisik->id,
    'category_id' => $catLanyard->id,
    'name' => 'ID Card PVC (Saja)',
    'category' => 'ID Card',
    'price' => 10000,
]);
Template::create([
    'service_id' => $cetakFisik->id,
    'category_id' => $catLanyard->id,
    'name' => 'Paket Lanyard + ID Card',
    'category' => 'Paket',
    'price' => 22000,
]);

// Add Templates for Print
Template::create([
    'service_id' => $cetakFisik->id,
    'category_id' => $catPrint->id,
    'name' => 'Print Warna A4',
    'category' => 'Print',
    'price' => 1000,
]);
Template::create([
    'service_id' => $cetakFisik->id,
    'category_id' => $catPrint->id,
    'name' => 'Print Hitam Putih A4',
    'category' => 'Print',
    'price' => 500,
]);

echo "Cetak Fisik Categories and Templates seeded!\n";
