<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Template;
use App\Models\InvitationVisitor;
use App\Models\Invitation;

$templates = Template::whereNotNull('invitation_id')->get();
$totalInserted = 0;

foreach ($templates as $template) {
    // Current count in visitors table
    $visitorCount = InvitationVisitor::where('invitation_id', $template->invitation_id)->count();
    
    // Expected views (from template table)
    $expectedViews = ($template->demo_views ?? 0) + ($template->total_invitation_views ?? 0);
    
    $diff = $expectedViews - $visitorCount;
    
    if ($diff > 0) {
        echo "Template {$template->name} has {$expectedViews} views but only {$visitorCount} visitor logs. Inserting {$diff} records...\n";
        
        // Insert missing records
        $insertData = [];
        for ($i = 0; $i < $diff; $i++) {
            $insertData[] = [
                'invitation_id' => $template->invitation_id,
                'ip_address' => '127.0.0.1', // placeholder
                'user_agent' => 'System Sync',
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            // Chunk inserts to avoid memory issues if diff is large
            if (count($insertData) >= 500) {
                InvitationVisitor::insert($insertData);
                $insertData = [];
            }
        }
        
        if (count($insertData) > 0) {
            InvitationVisitor::insert($insertData);
        }
        
        $totalInserted += $diff;
    } elseif ($diff < 0) {
        echo "Template {$template->name} has {$visitorCount} visitor logs but only {$expectedViews} expected views. Updating template views...\n";
        $template->demo_views = $visitorCount;
        $template->save();
    }
}

echo "Done! Total inserted visitor logs: {$totalInserted}\n";
