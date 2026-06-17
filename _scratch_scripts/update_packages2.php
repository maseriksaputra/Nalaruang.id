<?php

$data = [
    [
        'id' => 1,
        'service_id' => 1,
        'name' => 'Lite',
        'price' => '14.999',
        'description' => 'Tampil Elegan & Informatif',
        'features' => [
            'Masa Aktif Undangan: 14 Hari',
            'Tamu Tak Terbatas & Akses Portal Klien',
            'Desain Template Statis',
            'Halaman Acara, Lokasi & Integrasi Maps',
            'Countdown, Formulir RSVP & Ucapan',
            'Revisi Teks & Data: 1 Kali'
        ],
        'is_popular' => false,
        'sort_order' => 1,
    ],
    [
        'id' => 2,
        'service_id' => 1,
        'name' => 'Basic',
        'price' => '24.999',
        'description' => 'Lebih Hidup dengan Momen',
        'features' => [
            'Masa Aktif Undangan: 1 Bulan',
            'Semua Fitur Paket Lite',
            'Galeri Foto (Maksimal 5 Foto)',
            'Desain Animasi Dasar (Fade)',
            'Bebas Request Backsound Musik',
            'Revisi Teks & Data: 3 Kali'
        ],
        'is_popular' => false,
        'sort_order' => 2,
    ],
    [
        'id' => 3,
        'service_id' => 1,
        'name' => 'Standard',
        'price' => '39.999',
        'description' => 'Pilihan Ideal & Terpopuler',
        'features' => [
            'Masa Aktif Undangan: 3 Bulan',
            'Semua Fitur Paket Basic',
            'Galeri Foto (Maksimal 15 Foto)',
            'Bebas Request Wording / Kutipan',
            'Buku Tamu Digital (QR Code)',
            'Revisi Teks & Data: 10 Kali'
        ],
        'is_popular' => false,
        'sort_order' => 3,
    ],
    [
        'id' => 4,
        'service_id' => 1,
        'name' => 'Premium',
        'price' => '49.999',
        'description' => 'Kustomisasi Warna & Interaktif',
        'features' => [
            'Masa Aktif Undangan: 6 Bulan',
            'Semua Fitur Paket Standard',
            'Galeri Foto (Maksimal 25 Foto)',
            'Bebas Request Tema Warna Spesifik',
            'Animasi Interaktif Lanjutan',
            'Revisi Teks & Data: 20 Kali'
        ],
        'is_popular' => true,
        'sort_order' => 4,
    ],
    [
        'service_id' => 1,
        'name' => 'Exclusive',
        'price' => '79.999',
        'description' => 'Bebas Khawatir Sampai Hari H',
        'features' => [
            'Masa Aktif Undangan: 1 Tahun',
            'Semua Fitur Paket Premium',
            'Galeri Foto & Video Prewedding',
            'Bebas Request Elemen/Ornamen Tambahan',
            'Prioritas Pengerjaan (Fast Track)',
            'Revisi Teks & Data: Unlimited'
        ],
        'is_popular' => false,
        'sort_order' => 5,
    ],
    [
        'service_id' => 1,
        'name' => 'Custom VIP',
        'price' => '99.999',
        'description' => 'Eksklusif Sesuai Imajinasi',
        'features' => [
            'Masa Aktif Undangan: Selamanya',
            'Galeri Foto & Video Unlimited',
            'Desain Layout Kustomisasi Penuh',
            'Bebas Request Fitur Khusus (Live, dll)',
            'Request Animasi & Multiple Backsound',
            'Revisi Unlimited & Layanan VIP'
        ],
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
            'features' => json_encode($item['features']),
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
echo "Packages refined and updated!\n";
