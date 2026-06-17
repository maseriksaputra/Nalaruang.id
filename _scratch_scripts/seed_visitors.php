<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Invitation;
use App\Models\Guest;
use App\Models\Rsvp;
use App\Models\InvitationVisitor;
use Faker\Factory as Faker;
use Carbon\Carbon;

echo "Menyiapkan Data Dummy Statistik...\n";

$faker = Faker::create('id_ID');

$invitations = Invitation::all();

if ($invitations->isEmpty()) {
    echo "Belum ada invitation. Silakan jalankan seeder lain atau buat undangan dulu dari builder.\n";
    exit;
}

echo "Membersihkan data statistik lama...\n";
Guest::truncate();
Rsvp::truncate();
InvitationVisitor::truncate();

echo "Mulai mengisi Guest, RSVP, dan Kunjungan Server (Visits)...\n";

$rsvpStatuses = ['Hadir', 'Hadir', 'Hadir', 'Tidak Hadir', 'Pending', 'Hadir'];

foreach ($invitations as $invitation) {
    // 1. Generate 50-150 tamu untuk tiap undangan
    $guestCount = rand(50, 150);
    for ($i = 0; $i < $guestCount; $i++) {
        Guest::create([
            'invitation_id' => $invitation->id,
            'name' => $faker->name,
            'url_parameter' => $faker->slug,
            'whatsapp_number' => $faker->phoneNumber,
        ]);
    }

    // 2. Generate 10-40 RSVP untuk tiap undangan
    $rsvpCount = rand(10, 40);
    for ($i = 0; $i < $rsvpCount; $i++) {
        Rsvp::create([
            'invitation_id' => $invitation->id,
            'name' => $faker->name,
            'status' => $rsvpStatuses[array_rand($rsvpStatuses)],
            'message' => rand(1,10) > 3 ? $faker->sentence : null,
            'created_at' => Carbon::now()->subDays(rand(1, 30)),
        ]);
    }

    // 3. Generate Kunjungan (Visits) selama 30 hari terakhir
    // Kurva harus fluktuatif, kita kasih random jumlah visit per harinya
    $totalVisitsForThisInv = rand(500, 2000); // 500-2000 visits per undangan dlm sebulan
    for ($i = 0; $i < $totalVisitsForThisInv; $i++) {
        // Random days ago between 0 and 29
        $daysAgo = rand(0, 29);
        $date = Carbon::now()->subDays($daysAgo)->subHours(rand(1, 23))->subMinutes(rand(1, 59));
        
        InvitationVisitor::insert([
            'invitation_id' => $invitation->id,
            'ip_address' => $faker->ipv4,
            'user_agent' => $faker->userAgent,
            'created_at' => $date,
            'updated_at' => $date,
        ]);
    }
}

echo "Berhasil! Data dummy Statistik siap! Silakan cek Dashboard Admin.\n";
