<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$template = \App\Models\Template::where('name', 'Template 2')->first();
if ($template) {
    $template->form_schema = [
        [
            'field_name' => 'Foto Galeri & Mempelai',
            'type' => 'image',
            'is_required' => true,
            'max_files' => 10
        ],
        [
            'field_name' => 'File Audio / Musik Latar (MP3/WAV)',
            'type' => 'audio',
            'is_required' => false
        ],
        [
            'field_name' => 'Cerita Cinta / Quotes Khusus',
            'type' => 'textarea',
            'is_required' => false
        ],
        [
            'field_name' => 'Data Rekening Amplop Digital (Nama Bank, No Rek, Atas Nama)',
            'type' => 'textarea',
            'is_required' => false
        ],
        [
            'field_name' => 'Waktu & Tanggal Acara',
            'type' => 'textarea',
            'is_required' => true
        ],
        [
            'field_name' => 'Link Lokasi Acara (Google Maps)',
            'type' => 'text',
            'is_required' => true
        ],
        [
            'field_name' => 'Request Warna Tema / Custom Kata / Catatan',
            'type' => 'textarea',
            'is_required' => false
        ]
    ];
    $template->save();
    echo "Fixed Template 2 form schema!";
}
