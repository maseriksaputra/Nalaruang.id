<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientFormController;

Route::get('/', [\App\Http\Controllers\PublicController::class, 'index']);
Route::get('/layanan/{slug}', [ServiceController::class, 'show'])->name('service.show');

// Client Form Routes
Route::get('/client/form/{token}', [ClientFormController::class, 'show'])->name('client.form.show');
Route::post('/client/form/{token}', [ClientFormController::class, 'submit'])->name('client.form.submit');

Route::get('/test-post', function () {
    return '<form method="POST" action="/test-post-submit"><input type="hidden" name="_token" value="'.csrf_token().'"><button type="submit">Test POST</button></form>';
});
Route::post('/test-post-submit', function () {
    return 'POST BERHASIL! Berarti masalahnya ada di Livewire, bukan Nginx.';
});

Route::get('/order/{template_id}', [OrderController::class, 'create'])->name('order.create');
Route::post('/order', [OrderController::class, 'store'])->name('order.store');

Route::get('/debug-log', function () {
    $logFile = storage_path('logs/laravel.log');
    if (!file_exists($logFile)) return 'No log file';
    
    $lines = shell_exec('tail -n 50 ' . escapeshellarg($logFile));
    return response("<pre>" . htmlspecialchars($lines) . "</pre>");
});

// Route::get('/fix-cashflow-data', function() {
//     \App\Models\Cashflow::where('type', 'expense')->where('amount', '>', 0)->update(['amount' => \Illuminate\Support\Facades\DB::raw('-amount')]);
//     return 'Database migrated successfully!';
// });

Route::get('/fix-services', function () {
    $service = \App\Models\Service::firstOrCreate(
        ['slug' => 'event-digital'],
        [
            'title' => 'Event Digital',
            'description' => 'Layanan pembuatan undangan digital interaktif dan modern.',
            'is_active' => true,
            'sort_order' => 1
        ]
    );
    $cetakFisik = \App\Models\Service::where('slug', 'undangan-cetak')->orWhere('slug', 'cetak-fisik')->first();
    if ($cetakFisik) {
        $cetakFisik->update([
            'slug' => 'cetak-fisik-premium',
            'title' => 'Cetak Fisik Premium'
        ]);
    } else {
        \App\Models\Service::firstOrCreate(
            ['slug' => 'cetak-fisik-premium'],
            [
                'title' => 'Cetak Fisik Premium',
                'description' => 'Layanan cetak undangan premium.',
                'is_active' => true,
                'sort_order' => 2
            ]
        );
    }
    \App\Models\Service::firstOrCreate(
        ['slug' => 'souvenir-merchandise'],
        [
            'title' => 'Souvenir & Merchandise',
            'description' => 'Layanan pembuatan souvenir dan merchandise eksklusif.',
            'is_active' => true,
            'sort_order' => 3
        ]
    );
    return 'Layanan berhasil dibuat di database! Silakan cek kembali halaman depan.';
});

Route::get('/fix-all', function () {
    // 1. Create Web & Mobile App Service
    $webSvc = \App\Models\Service::firstOrCreate(
        ['slug' => 'web-mobile-app'],
        [
            'title' => 'Web & Mobile App',
            'description' => 'Layanan pembuatan website dan aplikasi mobile profesional.',
            'is_active' => true,
            'sort_order' => 2
        ]
    );

    // 2. Create Cetak Fisik Service
    $cetakSvc = \App\Models\Service::firstOrCreate(
        ['slug' => 'cetak-fisik'],
        [
            'title' => 'Cetak Fisik',
            'description' => 'Layanan cetak fisik premium.',
            'is_active' => true,
            'sort_order' => 3
        ]
    );

    // Packages for Web & Mobile App
    $webPackages = [
        [
            'name' => 'Exclusive',
            'price' => 79.999,
            'description' => 'Bebas Khawatir Sampai Hari H',
            'features' => ["Semua Fitur Premium","Galeri Foto & Video","Request Elemen Tambahan","Prioritas Pengerjaan (Fast Track)","Dukungan Tim Ahli","Tamu Tak Terbatas","Masa Aktif 1 Tahun","Revisi Unlimited"],
            'is_popular' => false,
            'sort_order' => 5,
            'is_customizable' => false
        ],
        [
            'name' => 'Custom VIP',
            'price' => 99.999,
            'description' => 'Eksklusif Sesuai Imajinasi',
            'features' => ["Semua Fitur Exclusive","Galeri Foto & Video Unlimited","Layout Kustomisasi Penuh","Bebas Request Fitur Khusus","Multiple Backsound Lanjutan","Tamu Tak Terbatas","Masa Aktif Selamanya","Revisi Unlimited & VIP Support"],
            'is_popular' => false,
            'sort_order' => 6,
            'is_customizable' => false
        ],
        [
            'name' => 'Custom Web App',
            'price' => 3000000,
            'description' => 'Sistem informasi, reservasi atau kasir',
            'features' => ["Desain UI/UX Custom (Figma)","Sistem Login & Dashboard Admin","Database & Fitur Sesuai Request","Integrasi API (Payment Gateway, dll)","Maintenance 3 Bulan Gratis"],
            'is_popular' => false,
            'sort_order' => 3,
            'is_customizable' => false
        ]
    ];

    foreach ($webPackages as $pkg) {
        \App\Models\Package::updateOrCreate(
            ['service_id' => $webSvc->id, 'name' => $pkg['name']],
            $pkg
        );
    }
    
    // Default packages for Cetak Fisik
    $cetakPackages = [
        [
            'name' => 'Standard Cetak',
            'price' => 5000,
            'description' => 'Cetak bahan Art Carton Premium',
            'features' => ["Art Carton 260gsm","Laminasi Doff/Glossy","Gratis Plastik OPP","Gratis Label Nama","Minimal Order 100 pcs"],
            'is_popular' => true,
            'sort_order' => 1,
            'is_customizable' => false
        ],
        [
            'name' => 'Premium Hardcover',
            'price' => 15000,
            'description' => 'Undangan Hardcover Mewah',
            'features' => ["Hardcover Premium","Foil Emas/Perak","Emboss Letter","Gratis Plastik OPP","Gratis Label Nama","Minimal Order 100 pcs"],
            'is_popular' => false,
            'sort_order' => 2,
            'is_customizable' => false
        ]
    ];

    foreach ($cetakPackages as $pkg) {
        \App\Models\Package::updateOrCreate(
            ['service_id' => $cetakSvc->id, 'name' => $pkg['name']],
            $pkg
        );
    }

    return 'Layanan Cetak Fisik & Web Mobile App beserta paketnya berhasil disuntikkan! Silakan kembali ke website dan Refresh.';
});

Route::get('/fix-packages', function () {
    $service = \App\Models\Service::where('slug', 'event-digital')->first();
    if (!$service) return 'Layanan Event Digital belum ada. Jalankan /fix-services dulu.';

    $packages = [
        [
            'name' => 'Lite',
            'price' => 14.999,
            'description' => 'Tampil Elegan & Informatif',
            'features' => ["Masa Aktif Undangan: 14 Hari","Nama Tamu & Share Unlimited","Formulir RSVP & Ucapan Tamu","Akses Dashboard Klien","Desain Template Statis","Halaman Acara, Lokasi & Maps","Revisi Teks & Data: 3 Kali"],
            'is_popular' => false,
            'sort_order' => 1,
            'is_customizable' => false
        ],
        [
            'name' => 'Basic',
            'price' => 24.999,
            'description' => 'Lebih Hidup dengan Momen',
            'features' => ["Masa Aktif Undangan: 1 Bulan","Nama Tamu & Share Unlimited","Formulir RSVP & Ucapan Tamu","Semua Fitur Paket Lite","Galeri Foto (Maksimal 5 Foto)","Animasi Transisi Dasar (Fade)","Custom Musik/Backsound","Revisi Teks & Data: 5 Kali"],
            'is_popular' => false,
            'sort_order' => 2,
            'is_customizable' => true
        ],
        [
            'name' => 'Standard',
            'price' => 39.999,
            'description' => 'Pilihan Ideal & Terpopuler',
            'features' => ["Masa Aktif Undangan: 3 Bulan","Nama Tamu & Share Unlimited","Formulir RSVP & Ucapan Tamu","Semua Fitur Paket Basic","Galeri Foto (Maksimal 15 Foto)","Custom Wording/Kutipan","Buku Tamu Digital (QR Code)","Revisi Teks & Data: 10 Kali"],
            'is_popular' => false,
            'sort_order' => 3,
            'is_customizable' => true
        ],
        [
            'name' => 'Premium',
            'price' => 49.999,
            'description' => 'Kustomisasi Warna & Interaktif',
            'features' => ["Masa Aktif Undangan: 6 Bulan","Nama Tamu & Share Unlimited","Formulir RSVP & Ucapan Tamu","Semua Fitur Paket Standard","Galeri Foto (Maksimal 25 Foto)","Custom Tema Warna Spesifik","Animasi Interaktif Lanjutan","Revisi Teks & Data: 20 Kali"],
            'is_popular' => true,
            'sort_order' => 4,
            'is_customizable' => true
        ],
        [
            'name' => 'Exclusive',
            'price' => 79.999,
            'description' => 'Bebas Khawatir Sampai Hari H',
            'features' => ["Masa Aktif Undangan: 1 Tahun","Nama Tamu & Share Unlimited","Formulir RSVP & Ucapan Tamu","Semua Fitur Paket Premium","Galeri Foto & Video Prewedding","Custom Elemen/Ornamen","Prioritas Pengerjaan (Fast Track)","Revisi Teks & Data: Unlimited"],
            'is_popular' => false,
            'sort_order' => 5,
            'is_customizable' => false
        ],
        [
            'name' => 'Custom VIP',
            'price' => 99.999,
            'description' => 'Eksklusif Sesuai Imajinasi',
            'features' => ["Masa Aktif Undangan: Selamanya","Nama Tamu & Share Unlimited","Formulir RSVP & Ucapan Tamu","Galeri Foto & Video Unlimited","Layout Desain Bebas Custom","Fitur Khusus (Live Streaming, dll)","Request Multiple Backsound","Revisi Unlimited & Layanan VIP"],
            'is_popular' => false,
            'sort_order' => 6,
            'is_customizable' => false
        ],
    ];

    foreach ($packages as $pkg) {
        \App\Models\Package::updateOrCreate(
            ['service_id' => $service->id, 'name' => $pkg['name']],
            $pkg
        );
    }
    
    return 'Paket untuk Event Digital berhasil dibuat persis seperti di lokal!';
});

// Routes untuk SaaS Undangan Digital (Protected by Auth)
Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/admin/invitation-portal', [\App\Http\Controllers\DashboardPortalController::class, 'index']);
    Route::get('/admin/invitation-portal/list', [\App\Http\Controllers\DashboardPortalController::class, 'getInvitations']);
    Route::get('/admin/invitation-portal/statistics', [\App\Http\Controllers\DashboardPortalController::class, 'getStatistics']);
    Route::get('/admin/invitation-portal/templates', [\App\Http\Controllers\DashboardPortalController::class, 'getTemplates']);
    Route::post('/admin/invitation-portal/templates/{id}/duplicate', [\App\Http\Controllers\DashboardPortalController::class, 'duplicateTemplate']);
    Route::post('/admin/invitation-portal/templates/{id}/toggle', [\App\Http\Controllers\DashboardPortalController::class, 'toggleTemplate']);
    Route::post('/admin/invitation-portal/templates/{id}/thumbnail', [\App\Http\Controllers\DashboardPortalController::class, 'updateThumbnail']);

    // Mock Order untuk testing form klien
    // Route::get('/admin/mock-order', function () {
    //     $template = \App\Models\Template::latest('id')->first();
    //     if (!$template) {
    //         return "Silakan simpan sebuah template di Builder terlebih dahulu agar ada template di katalog.";
    //     }
    //     
    //     $order = \App\Models\Order::create([
    //         'template_id' => $template->id,
    //         'package_id' => $template->package_id ?? 1,
    //         'customer_name' => 'Tester Klien ' . rand(100, 999),
    //         'customer_phone' => '081234567890',
    //         'event_date' => now()->addDays(30),
    //         'quantity' => 1,
    //         'status' => 'pending',
    //         'total_price' => $template->price ?? 0,
    //     ]);
    //
    //     return redirect('/admin/invitation-portal?tab=pesanan')->with('success', 'Mock Order berhasil dibuat untuk Template: ' . $template->name);
    // });

    Route::get('/admin/invitation-portal/template-folders', [\App\Http\Controllers\DashboardPortalController::class, 'getTemplateFolders']);
    Route::post('/admin/invitation-portal/template-folders', [\App\Http\Controllers\DashboardPortalController::class, 'storeTemplateFolder']);
    Route::get('/admin/invitation-portal/rsvps', [\App\Http\Controllers\DashboardPortalController::class, 'getRsvps']);
    Route::get('/admin/invitation-portal/{id}/links', [\App\Http\Controllers\DashboardPortalController::class, 'getGuestLinks']);
    Route::post('/admin/invitation-portal/{id}/links', [\App\Http\Controllers\DashboardPortalController::class, 'storeGuestLink']);
    Route::post('/admin/invitation-portal/{id}/links/batch', [\App\Http\Controllers\DashboardPortalController::class, 'storeBatchGuestLinks']);
    Route::post('/admin/invitation-portal/{id}/greeting', [\App\Http\Controllers\DashboardPortalController::class, 'updateGreeting']);
    Route::post('/admin/invitation-portal/{id}/rename', [\App\Http\Controllers\DashboardPortalController::class, 'renameInvitation']);
    Route::delete('/admin/invitation-portal/{id}', [\App\Http\Controllers\DashboardPortalController::class, 'deleteInvitation']);
    Route::post('/admin/invitation-portal/create', [\App\Http\Controllers\DashboardPortalController::class, 'store']);
    Route::get('/admin/builder/{id}', [\App\Http\Controllers\BuilderController::class, 'show']);
    Route::post('/admin/builder/upload-media', [\App\Http\Controllers\BuilderController::class, 'uploadMedia']);
    Route::post('/admin/builder/{id}/autosave', [\App\Http\Controllers\BuilderController::class, 'autoSave']);
    Route::post('/admin/builder/{id}/publish', [\App\Http\Controllers\BuilderController::class, 'publish']);
    Route::get('/admin/builder/global-elements', [\App\Http\Controllers\GlobalElementController::class, 'index']);
    Route::post('/admin/builder/global-elements', [\App\Http\Controllers\GlobalElementController::class, 'store']);
    Route::post('/admin/builder/global-elements/upload', [\App\Http\Controllers\GlobalElementController::class, 'uploadMedia']);
    Route::delete('/admin/builder/global-elements/{id}', [\App\Http\Controllers\GlobalElementController::class, 'destroy']);

    // SaaS Portal Orders Routes
    Route::get('/admin/invitation-portal/orders', [\App\Http\Controllers\DashboardPortalController::class, 'getOrders']);
    Route::post('/admin/invitation-portal/orders/{id}/status', [\App\Http\Controllers\DashboardPortalController::class, 'updateOrderStatus']);
    Route::post('/admin/invitation-portal/orders/{id}/generate-form', [\App\Http\Controllers\DashboardPortalController::class, 'generateOrderForm']);
    Route::post('/admin/invitation-portal/orders/{id}/generate-project', [\App\Http\Controllers\DashboardPortalController::class, 'generateOrderProject']);
    Route::delete('/admin/invitation-portal/orders/{id}', [\App\Http\Controllers\DashboardPortalController::class, 'deleteOrder']);
    Route::post('/admin/invitation-portal/orders/{id}/rename', [\App\Http\Controllers\DashboardPortalController::class, 'renameOrder']);

    Route::get('/admin/builder/user-assets', [\App\Http\Controllers\Api\Builder\UserAssetController::class, 'index']);
    Route::post('/admin/builder/user-assets', [\App\Http\Controllers\Api\Builder\UserAssetController::class, 'store']);
    Route::delete('/admin/builder/user-assets/{id}', [\App\Http\Controllers\Api\Builder\UserAssetController::class, 'destroy']);

    Route::get('/api/builder/client-assets/{invitation_id}', [\App\Http\Controllers\BuilderController::class, 'getClientAssets']);
});

// Auto-save route (menggunakan middleware web untuk dukungan CSRF dari Axios apiClient)
Route::put('/api/builder/invitations/{id}/auto-save', [\App\Http\Controllers\BuilderController::class, 'autoSave']);
Route::post('/api/builder/invitations/{id}/save-as-template', [\App\Http\Controllers\BuilderController::class, 'saveAsTemplate']);



// Route Viewer Engine Publik
Route::get('/client/{slug}', [\App\Http\Controllers\ClientPortalController::class, 'show']);
Route::post('/client/{slug}/links/batch', [\App\Http\Controllers\ClientPortalController::class, 'storeBatchGuestLinks']);
Route::post('/client/{slug}/greeting', [\App\Http\Controllers\ClientPortalController::class, 'updateGreeting']);
Route::delete('/client/{slug}/links/{id}', [\App\Http\Controllers\ClientPortalController::class, 'deleteGuestLink']);

Route::get('/{slug}', [\App\Http\Controllers\ViewerController::class, 'show']);
Route::get('/{slug}/rsvps', [\App\Http\Controllers\ViewerController::class, 'getRsvps']);
Route::post('/{slug}/rsvp', [\App\Http\Controllers\ViewerController::class, 'submitRsvp']);
