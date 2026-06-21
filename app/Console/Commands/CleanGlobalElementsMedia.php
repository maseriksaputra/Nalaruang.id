<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\GlobalElement;

class CleanGlobalElementsMedia extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'builder:clean-global-media';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up unreferenced global elements media files to free up storage.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting cleanup of unreferenced global elements media...');

        $disk = config('filesystems.default');
        $storage = Storage::disk($disk);
        $directory = 'global_elements_media';

        if (!$storage->exists($directory)) {
            $this->info("Directory '{$directory}' does not exist. Nothing to clean.");
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

        $deletedCount = 0;
        $totalFreedBytes = 0;

        foreach ($allFiles as $file) {
            $fileUrl = $storage->url($file);
            
            // Check if this URL is referenced in the database
            if (!in_array($fileUrl, $referencedUrls)) {
                $size = $storage->size($file);
                $storage->delete($file);
                
                $deletedCount++;
                $totalFreedBytes += $size;
                
                $this->line("Deleted unreferenced file: {$file} (" . round($size / 1024 / 1024, 2) . " MB)");
            }
        }

        $freedMb = round($totalFreedBytes / 1024 / 1024, 2);
        $this->info("Cleanup completed! Deleted {$deletedCount} unreferenced files, freeing up {$freedMb} MB of storage.");
    }
}
