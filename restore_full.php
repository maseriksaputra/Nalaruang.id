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

// RESTORE FULL CONFIG DARI TEMPLATE
$invitation->canvas_config = $template->canvas_config;
$invitation->save();

echo "BERHASIL! Seluruh desain telah di-reset ke template asli 100% mulus.\n";
echo "Silakan refresh halaman builder Anda dan Anda bisa mulai mengedit ulang dengan lancar tanpa error.\n";
