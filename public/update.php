<?php

echo "<div style='font-family: sans-serif; padding: 20px;'>";
echo "<h2>🚀 Memulai Proses Update Nalaruang.id...</h2><hr>";

echo "<h3>1. Menarik Kode Terbaru dari Github (Git Pull)</h3>";
echo "<pre style='background:#f4f4f4; padding:10px; border-radius:5px;'>";
$gitOutput = shell_exec('git pull origin main 2>&1');
if (!$gitOutput) {
    echo "Peringatan: Fungsi shell_exec mungkin dimatikan di server Anda, atau proses Git gagal.\n";
} else {
    echo htmlspecialchars($gitOutput);
}
echo "</pre>";

echo "<h3>2. Sinkronisasi Database & Cache Laravel</h3>";
echo "<pre style='background:#f4f4f4; padding:10px; border-radius:5px;'>";
try {
    require __DIR__.'/../vendor/autoload.php';
    $app = require_once __DIR__.'/../bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

    echo "Menjalankan Migrasi...\n";
    $kernel->call('migrate', ['--force' => true]);
    echo $kernel->output() . "\n\n";

    echo "Membersihkan Cache...\n";
    $kernel->call('optimize:clear');
    echo $kernel->output();
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
echo "</pre>";

echo "<h2 style='color: green;'>✅ Update Berhasil Dieksekusi!</h2>";
echo "<a href='/admin' style='display:inline-block; padding:10px 15px; background:#C40B93; color:white; text-decoration:none; border-radius:5px;'>Kembali ke Dashboard</a>";
echo "</div>";
