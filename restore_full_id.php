<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$id = $argv[1] ?? null;
$templateId = $argv[2] ?? null;

if (!$id || !$templateId) {
    echo "Cara pakai: php restore_full_id.php <ID_UNDANGAN_YANG_RUSAK> <ID_TEMPLATE_YANG_BENAR>\n";
    exit;
}

$invitation = App\Models\Invitation::find($id);
if (!$invitation) {
    echo "Undangan dengan ID $id tidak ditemukan.\n";
    exit;
}

$template = App\Models\Invitation::where('is_template', true)->where('id', $templateId)->first();
if (!$template) {
    echo "Template dengan ID $templateId tidak ditemukan.\n";
    exit;
}

$invitation->canvas_config = $template->canvas_config;
$invitation->save();

echo "BERHASIL! Undangan ID $id telah di-reset ke template ID $templateId 100% mulus.\n";
echo "Silakan refresh halaman builder Anda.\n";
