<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\GlobalElement;

class SyncGlobalElementsMedia extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'builder:sync-global-media';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync uploaded files that are missing from the database to recover lost uploads.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting sync of unreferenced global elements media...');

        $disk = config('filesystems.default');
        $storage = Storage::disk($disk);
        $directory = 'global_elements_media';

        if (!$storage->exists($directory)) {
            $this->info("Directory '{$directory}' does not exist. Nothing to sync.");
            return;
        }

        $allFiles = $storage->files($directory);
        $this->info('Total files found in storage: ' . count($allFiles));

        // Get all referenced URLs from database
        $elements = GlobalElement::all();
        $referencedUrls = [];

        foreach ($elements as $element) {
            $payload = $element->payload;
            if (isset($payload['url'])) {
                $referencedUrls[] = $payload['url'];
            }
        }

        $syncedCount = 0;

        // Ensure user_id column exists before doing this
        if (!\Illuminate\Support\Facades\Schema::hasColumn('global_elements', 'user_id')) {
            $this->error('The user_id column does not exist! Please run "php artisan builder:fix-db" first.');
            return;
        }

        foreach ($allFiles as $file) {
            $fileUrl = $storage->url($file);
            
            // Check if this URL is referenced in the database
            if (!in_array($fileUrl, $referencedUrls)) {
                $this->info("Recovering missing file: {$file}");
                
                // Construct a default element for this file
                $filename = basename($file);
                
                // Estimate type from extension
                $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
                $type = in_array($ext, ['mp4', 'mov', 'webm']) ? 'video' : 'image';
                
                GlobalElement::create([
                    'user_id' => null,
                    'name' => 'Recovered ' . $filename,
                    'type' => $type,
                    'category' => 'Pulih dari Storage',
                    'payload' => [
                        'type' => $type,
                        'url' => $fileUrl,
                        'style' => [
                            'x' => 50,
                            'y' => 50,
                            'width' => 150,
                            'height' => 150
                        ]
                    ]
                ]);
                
                $syncedCount++;
            }
        }

        $this->info("Sync completed! Recovered {$syncedCount} files into the 'Pulih dari Storage' category.");
    }
}
