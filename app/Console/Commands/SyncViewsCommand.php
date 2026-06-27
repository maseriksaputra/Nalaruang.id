<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SyncViewsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-views';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincronize template demo_views with invitation_visitors records';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $templates = \App\Models\Template::whereNotNull('invitation_id')->get();
        $totalInserted = 0;

        foreach ($templates as $template) {
            $visitorCount = \App\Models\InvitationVisitor::where('invitation_id', $template->invitation_id)->count();
            $expectedViews = ($template->demo_views ?? 0) + ($template->total_invitation_views ?? 0);
            $diff = $expectedViews - $visitorCount;
            
            if ($diff !== 0) {
                $this->info("Template {$template->name}: has {$visitorCount} logs but expected {$expectedViews} views. Syncing template demo_views to match actual visitor logs...");
                
                $newDemoViews = $visitorCount - ($template->total_invitation_views ?? 0);
                
                // Pastikan tidak negatif
                if ($newDemoViews < 0) {
                    $newDemoViews = 0;
                }
                
                $template->demo_views = $newDemoViews;
                $template->save();
                
                $totalInserted++;
            }
        }

        $this->info("Sync complete! Total templates synced: {$totalInserted}");
    }
}
