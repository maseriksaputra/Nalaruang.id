<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Service;
use App\Models\Package;

Service::truncate();
Package::truncate();

// 1. Event Digital (Undangan Digital)
$digital = Service::create([
    'title' => 'Event Digital',
    'slug' => 'event-digital',
    'category' => 'Digital',
    'description' => 'Solusi undangan modern masa kini. Lebih hemat, praktis, dan ramah lingkungan dengan fitur interaktif yang memukau tamu Anda.',
    'features' => ['Website Undangan Interaktif', 'Video Undangan Cinematic', 'Buku Tamu Digital (QR Code)', 'RSVP & Filter Instagram Acara'],
    'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>',
    'is_popular' => true,
    'sort_order' => 1
]);

Package::create(['service_id' => $digital->id, 'name' => 'Basic', 'price' => '20.000', 'description' => 'Tampil elegan dan simpel', 'features' => ['Desain Template Statis', 'Halaman Beranda', 'Informasi Acara & Lokasi (Maps)', 'Tanpa Animasi Elemen'], 'sort_order' => 1]);
Package::create(['service_id' => $digital->id, 'name' => 'Standard', 'price' => '50.000', 'description' => 'Paket menengah yang interaktif', 'features' => ['Semua Fitur Basic', 'Animasi Masuk (Fade in/up)', 'Penghitung Waktu Mundur (Countdown)', 'Galeri Foto (Max 5 Foto)', 'Backsound Musik Standard'], 'sort_order' => 2]);
Package::create(['service_id' => $digital->id, 'name' => 'Premium', 'price' => '80.000', 'description' => 'Fitur lengkap untuk momen spesial', 'features' => ['Semua Fitur Standard', 'RSVP & Ucapan Tamu', 'Galeri Foto (Max 15 Foto)', 'Buku Tamu Digital (QR Code)', 'Filter Instagram Acara', 'Revisi 3 Kali'], 'is_popular' => true, 'sort_order' => 3]);
Package::create(['service_id' => $digital->id, 'name' => 'Custom VIP', 'price' => '120.000', 'description' => 'Kustomisasi tanpa batas sesuai selera', 'features' => ['Semua Fitur Premium', 'Request Elemen Warna Khusus', 'Request Custom Backsound Lagu', 'Animasi Interaktif Lanjutan', 'Galeri Foto & Video Unlimited', 'Revisi Unlimited', 'Bebas Pilih Domain Sendiri'], 'sort_order' => 4]);


// 2. Web & Mobile App
$it = Service::create([
    'title' => 'Web & Mobile App',
    'slug' => 'web-mobile-app',
    'category' => 'IT',
    'description' => 'Jasa pembuatan aplikasi dan website profesional untuk mendigitalisasi bisnis Anda dengan teknologi terkini dan UI/UX yang modern.',
    'features' => ['UI/UX Design & Prototyping', 'Landing Page & Company Profile', 'Aplikasi Bisnis / Kasir Mobile', 'Sistem Reservasi Custom'],
    'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>',
    'is_popular' => false,
    'sort_order' => 2
]);

Package::create(['service_id' => $it->id, 'name' => 'Landing Page', 'price' => '750.000', 'description' => 'Situs 1 halaman untuk promosi / produk', 'features' => ['Desain 1 Halaman Premium', 'Responsive (Mobile & Desktop)', 'Integrasi WhatsApp', 'Hosting & Domain Gratis 1 Tahun', 'SEO Basic'], 'sort_order' => 1]);
Package::create(['service_id' => $it->id, 'name' => 'Company Profile', 'price' => '1.500.000', 'description' => 'Website profil perusahaan profesional', 'features' => ['Hingga 5 Halaman Web', 'Sistem Manajemen Konten (CMS)', 'Galeri Portofolio & Artikel Blog', 'Hosting & Domain Gratis 1 Tahun', 'SEO & Keamanan Standard'], 'is_popular' => true, 'sort_order' => 2]);
Package::create(['service_id' => $it->id, 'name' => 'Custom Web App', 'price' => '3.000.000+', 'description' => 'Sistem informasi, reservasi atau kasir', 'features' => ['Desain UI/UX Custom (Figma)', 'Sistem Login & Dashboard Admin', 'Database & Fitur Sesuai Request', 'Integrasi API (Payment Gateway, dll)', 'Maintenance 3 Bulan Gratis'], 'sort_order' => 3]);


// 3. Souvenir & Merchandise
$souvenir = Service::create([
    'title' => 'Souvenir & Merchandise',
    'slug' => 'souvenir-merchandise',
    'category' => 'Fisik',
    'description' => 'Tinggalkan kesan mendalam pada tamu undangan dengan souvenir berkualitas dan merchandise custom untuk corporate event.',
    'features' => ['Tumbler & Gelas Kaca Custom', 'Tasbih Premium & Box Estetik', 'Totebag Canvas Sablon', 'Plakat Akrilik & Kayu'],
    'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>',
    'is_popular' => false,
    'sort_order' => 3
]);

Package::create(['service_id' => $souvenir->id, 'name' => 'Mug & Tumbler', 'price' => '15.000', 'description' => 'Minimal order 50 pcs', 'features' => ['Desain Sablon/Print Custom', 'Packaging Box Minimalis', 'Pilihan Mug Keramik / Tumbler Plastik', 'Gratis Thanks Card'], 'sort_order' => 1]);
Package::create(['service_id' => $souvenir->id, 'name' => 'Premium Set', 'price' => '35.000', 'description' => 'Souvenir pernikahan mewah. Min 100 pcs', 'features' => ['Tasbih Premium / Sajadah Muka', 'Hardbox Eksklusif Custom Nama', 'Pita & Label Elegan', 'Gratis Ongkir (S&K Berlaku)'], 'is_popular' => true, 'sort_order' => 2]);
Package::create(['service_id' => $souvenir->id, 'name' => 'Custom Corporate', 'price' => 'Mulai 50.000', 'description' => 'Paket bundling untuk acara kantor', 'features' => ['Totebag Canvas Premium', 'Lanyard & ID Card Karyawan', 'Buku Agenda Custom', 'Pulpen Besi Engrafir Laser', 'Request Item Lain Tersedia'], 'sort_order' => 3]);

// 4. Cetak Fisik Premium
$cetak = Service::create([
    'title' => 'Cetak Fisik Premium',
    'slug' => 'cetak-fisik-premium',
    'category' => 'Fisik',
    'description' => 'Melayani cetak dokumen, undangan pernikahan cetak berkualitas dengan berbagai macam material kertas fancy.',
    'features' => ['Undangan Pernikahan Eksklusif', 'Custom Lanyard & ID Card', 'Buku Yasin & Majmu premium', 'Jasa Print & Fotocopy Dokumen'],
    'icon' => '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>',
    'is_popular' => false,
    'sort_order' => 4
]);

Package::create(['service_id' => $cetak->id, 'name' => 'Softcover Basic', 'price' => '3.500', 'description' => 'Per Pcs (Min 300 Pcs)', 'features' => ['Kertas BC / Brief Card tebal', 'Cetak Full Color', 'Plastik & Label Nama', 'Desain Template Bebas Pilih'], 'sort_order' => 1]);
Package::create(['service_id' => $cetak->id, 'name' => 'Hardcover Elegan', 'price' => '9.500', 'description' => 'Per Pcs (Min 300 Pcs)', 'features' => ['Kertas Jasmine (Glitter) Tebal', 'Hotprint Emas / Perak (Foil)', 'Emboss 3D Logo Nama', 'Bebas Custom Desain & Bentuk'], 'is_popular' => true, 'sort_order' => 2]);


echo "Dummy Services & Packages Seeded!\n";
