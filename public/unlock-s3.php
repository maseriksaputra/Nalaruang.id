<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

echo "<div style='font-family: sans-serif; padding: 20px; line-height: 1.6;'>";
echo "<h2>🔓 Membuka Gembok S3 IDCloudHost...</h2><hr>";

try {
    $client = new S3Client([
        'version'                 => 'latest',
        'region'                  => env('AWS_DEFAULT_REGION', 'us-east-1'),
        'endpoint'                => env('AWS_ENDPOINT'),
        'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', true),
        'credentials'             => [
            'key'    => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
        ],
    ]);

    $bucket = env('AWS_BUCKET');
    
    if (!$bucket) {
        die("<strong style='color:red;'>Error: AWS_BUCKET tidak ditemukan di file .env!</strong>");
    }

    echo "Sedang menyambungkan ke Bucket: <strong>{$bucket}</strong>...<br>";

    // Mengubah Bucket Policy agar Public Read
    $policy = json_encode([
        'Version' => '2012-10-17',
        'Statement' => [
            [
                'Sid' => 'PublicReadGetObject',
                'Effect' => 'Allow',
                'Principal' => '*',
                'Action' => ['s3:GetObject'],
                'Resource' => ["arn:aws:s3:::{$bucket}/*"]
            ]
        ]
    ]);

    $client->putBucketPolicy([
        'Bucket' => $bucket,
        'Policy' => $policy,
    ]);

    echo "<h3 style='color: green;'>✅ BERHASIL! Keranjang S3 Anda sekarang sudah berstatus PUBLIC!</h3>";
    echo "<p>Semua gambar di Nalaruang akan langsung bisa dilihat oleh pengunjung.</p>";
    echo "<p><strong>Tindakan selanjutnya:</strong> Silakan kembali ke website Nalaruang, hapus gambar yang putih/kosong tadi, dan unggah ulang gambarnya!</p>";

} catch (AwsException $e) {
    echo "<div style='background: #fee2e2; border: 1px solid #ef4444; padding: 15px; border-radius: 5px; color: #b91c1c;'>";
    echo "<strong>GAGAL MEMBUKA GEMBOK (Policy Error):</strong><br>" . $e->getAwsErrorMessage() . "<br><br>";
    
    echo "<em>Mencoba metode alternatif (Set ACL)...</em><br>";
    try {
        $client->putBucketAcl([
            'Bucket' => env('AWS_BUCKET'),
            'ACL'    => 'public-read',
        ]);
        echo "<h3 style='color: green;'>✅ BERHASIL (Via ACL)! Keranjang S3 Anda sekarang sudah berstatus PUBLIC!</h3>";
        echo "<p>Silakan kembali ke website Nalaruang, hapus gambar yang putih/kosong tadi, dan unggah ulang gambarnya!</p>";
    } catch (AwsException $e2) {
        echo "<strong style='color:red;'>Metode alternatif juga gagal:</strong> " . $e2->getAwsErrorMessage();
    }
    echo "</div>";
} catch (Exception $e) {
    echo "<strong style='color:red;'>Terjadi kesalahan sistem:</strong> " . $e->getMessage();
}

echo "</div>";
