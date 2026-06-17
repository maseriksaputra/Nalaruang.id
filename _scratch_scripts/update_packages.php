<?php

$data = [
    [
        'id' => 1,
        'service_id' => 1,
        'name' => 'Lite',
        'price' => '14.999',
        'description' => 'Tampil Elegan & Informatif',
        'features' => ['Desain Template Statis', 'Tanpa Galeri Foto', 'Halaman Beranda, Informasi Acara, & Lokasi', 'Integrasi Google Maps', 'Penghitung Waktu Mundur (Countdown)', 'Formulir RSVP & Kolom Ucapan Tamu', 'Backsound Musik', 'Revisi Teks & Data 1 Kali'],
        'is_popular' => false,
        'sort_order' => 1,
    ],
    [
        'id' => 2,
        'service_id' => 1,
        'name' => 'Basic',
        'price' => '24.999',
        'description' => 'Lebih Hidup dengan Momen',
        'features' => ['Semua Fitur Paket Lite', 'Galeri Foto (Max 5 Foto)', 'Desain Animasi Dasar', 'Bebas Request Backsound', 'Revisi 3 Kali'],
        'is_popular' => false,
        'sort_order' => 2,
    ],
    [
        'id' => 3,
        'service_id' => 1,
        'name' => 'Standard',
        'price' => '39.999',
        'description' => 'Pilihan Ideal & Terpopuler',
        'features' => ['Semua Fitur Paket Basic', 'Galeri Foto (Max 15 Foto)', 'Bebas Request Wording/Tulisan', 'Buku Tamu Digital (QR Code)', 'Revisi 10 Kali'],
        'is_popular' => false,
        'sort_order' => 3,
    ],
    [
        'id' => 4,
        'service_id' => 1,
        'name' => 'Premium',
        'price' => '49.999',
        'description' => 'Kustomisasi Warna & Interaktif',
        'features' => ['Semua Fitur Paket Standard', 'Galeri Foto (Max 25 Foto)', 'Bebas Request Tema Warna', 'Animasi Interaktif Lanjutan', 'Revisi 20 Kali'],
        'is_popular' => true,
        'sort_order' => 4,
    ],
    [
        'service_id' => 1,
        'name' => 'Exclusive',
        'price' => '79.999',
        'description' => 'Bebas Khawatir Sampai Hari H',
        'features' => ['Semua Fitur Paket Premium', 'Galeri Foto & Video', 'Bebas Request Elemen Tambahan', 'Prioritas Pengerjaan (Fast Track)', 'Revisi Unlimited'],
        'is_popular' => false,
        'sort_order' => 5,
    ],
    [
        'service_id' => 1,
        'name' => 'Custom VIP',
        'price' => '99.999',
        'description' => 'Eksklusif Sesuai Imajinasi',
        'features' => ['Semua Fitur Paket Exclusive', 'Galeri Foto & Video Unlimited', 'Desain Layout Kustomisasi Penuh', 'Bebas Request Fitur Khusus', 'Request Animasi & Multiple Backsound', 'Revisi Unlimited & Prioritas VIP'],
        'is_popular' => false,
        'sort_order' => 6,
    ]
];

foreach ($data as $item) {
    if (isset($item['id'])) {
        \App\Models\Package::where('id', $item['id'])->update([
            'name' => $item['name'],
            'price' => $item['price'],
            'description' => $item['description'],
            'features' => $item['features'],
            'is_popular' => $item['is_popular'],
            'sort_order' => $item['sort_order'],
        ]);
    } else {
        \App\Models\Package::updateOrCreate([
            'service_id' => $item['service_id'],
            'name' => $item['name']
        ], [
            'price' => $item['price'],
            'description' => $item['description'],
            'features' => $item['features'],
            'is_popular' => $item['is_popular'],
            'sort_order' => $item['sort_order'],
        ]);
    }
}
echo "Packages updated!\n";
