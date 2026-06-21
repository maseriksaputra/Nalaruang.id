<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$id = $argv[1] ?? 2;
$invitation = App\Models\Invitation::find($id);

if (!$invitation) {
    echo "Undangan dengan ID $id tidak ditemukan.\n";
    exit;
}

// Cari template aslinya
$template = null;
if ($invitation->order_id) {
    $order = App\Models\Order::find($invitation->order_id);
    if ($order && $order->template) {
        $template = App\Models\Invitation::where('is_template', true)->where('id', $order->template->invitation_id)->first();
    }
}
if (!$template) {
    $template = App\Models\Invitation::where('is_template', true)->first();
}

if (!$template) {
    echo "Template asli tidak ditemukan. Tidak bisa memulihkan.\n";
    exit;
}

$brokenConfig = $invitation->canvas_config;
$templateConfig = $template->canvas_config;

// Pulihkan Cover Page (Section 0)
$brokenConfig['sections'][0] = $templateConfig['sections'][0];

// Bersihkan layer yang rusak di semua section lain (Halaman Isi dll)
foreach ($brokenConfig['sections'] as $sIndex => &$section) {
    if ($sIndex === 0) continue; // Cover sudah diganti utuh
    if (isset($section['layers'])) {
        foreach ($section['layers'] as $lIndex => &$layer) {
            // Hapus layer yang bertuliskan [ELEMEN DIHAPUS...]
            if (isset($layer['content']) && strpos($layer['content'], 'ELEMEN DIHAPUS') !== false) {
                unset($section['layers'][$lIndex]);
            }
        }
        $section['layers'] = array_values($section['layers']);
    }
}

$invitation->canvas_config = $brokenConfig;
$invitation->save();

echo "BERHASIL! Halaman Cover (Nama, Tombol, dll) telah dikembalikan persis seperti aslinya.\n";
echo "Silakan refresh halaman builder Anda.\n";
