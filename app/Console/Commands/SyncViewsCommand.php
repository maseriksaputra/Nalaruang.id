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
            
            if ($diff > 0) {
                $this->info("Template {$template->name}: missing {$diff} visitor logs. Inserting...");
                
                $insertData = [];
                for ($i = 0; $i < $diff; $i++) {
                    $insertData[] = [
                        'invitation_id' => $template->invitation_id,
                        'ip_address' => '127.0.0.1',
                        'user_agent' => 'System Sync',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    
                    if (count($insertData) >= 500) {
                        \App\Models\InvitationVisitor::insert($insertData);
                        $insertData = [];
                    }
                }
                
                if (count($insertData) > 0) {
                    \App\Models\InvitationVisitor::insert($insertData);
                }
                
                $totalInserted += $diff;
            } elseif ($diff < 0) {
                // If visitors log is higher, update the template demo_views to match
                $this->info("Template {$template->name}: has {$visitorCount} logs but only {$expectedViews} views. Updating template views...");
                $template->demo_views = $visitorCount - ($template->total_invitation_views ?? 0);
                $template->save();
            }
        }

        $this->info("Sync complete! Total inserted visitor logs: {$totalInserted}");
    }
}
