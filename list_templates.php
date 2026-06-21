<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$templates = App\Models\Invitation::where('is_template', true)->get();
echo "DAFTAR TEMPLATE YANG TERSEDIA:\n";
echo "---------------------------------\n";
foreach ($templates as $t) {
    echo "ID Template: {$t->id} | Judul: {$t->title}\n";
}
echo "---------------------------------\n";
echo "Cara pakai restore:\n";
echo "php restore_full_id.php <ID_UNDANGAN_YANG_RUSAK> <ID_TEMPLATE_YANG_BENAR>\n";
