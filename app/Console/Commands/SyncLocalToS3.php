<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class SyncLocalToS3 extends Command
{
    protected $signature = 's3:sync-local';
    protected $description = 'Sync all local public files to S3 Object Storage';

    public function handle()
    {
        $this->info('Memulai sinkronisasi file lokal ke S3...');

        $localDisk = Storage::disk('public');
        $s3Disk = Storage::disk('s3');

        $files = $localDisk->allFiles();
        $total = count($files);
        $bar = $this->output->createProgressBar($total);

        $bar->start();

        foreach ($files as $file) {
            // Cek apakah file sudah ada di S3 agar tidak mengulang
            if (!$s3Disk->exists($file)) {
                $s3Disk->put($file, $localDisk->get($file));
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Berhasil! $total file telah disinkronkan ke CloudHost S3.");
    }
}
