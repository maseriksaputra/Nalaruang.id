<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Invitation;
use App\Models\Template;
use Illuminate\Support\Str;

class FixSlugs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fix-slugs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fixes all legacy UUID and desain-* slugs to readable format.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to fix slugs...');

        $invitations = Invitation::all();
        $fixedCount = 0;

        foreach ($invitations as $inv) {
            $needsFix = false;

            if (strlen($inv->slug) === 36) { // UUID
                $needsFix = true;
            } elseif ($inv->is_template && strpos($inv->slug, 'desain') !== false) {
                $needsFix = true;
            } elseif ($inv->id === 10 && $inv->slug !== 'radium') {
                $needsFix = true;
            }

            if ($needsFix) {
                if ($inv->id === 10) {
                    $baseSlug = 'radium';
                } else {
                    $baseSlug = Str::slug($inv->title);
                    if (empty($baseSlug)) {
                        $baseSlug = 'undangan';
                    }
                }

                $slug = $baseSlug;
                $counter = 1;
                while (Invitation::withTrashed()->where('slug', $slug)->where('id', '!=', $inv->id)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }

                $inv->slug = $slug;
                $inv->save();

                $template = Template::where('invitation_id', $inv->id)->first();
                if ($template) {
                    $template->preview_url = url('/' . $slug);
                    $template->save();
                }

                $this->line("Updated project ID {$inv->id} ({$inv->title}) to slug: {$slug}");
                $fixedCount++;
            }
        }

        $this->info("Finished! Fixed {$fixedCount} slugs.");
    }
}
