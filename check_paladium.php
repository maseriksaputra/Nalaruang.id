<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$template = App\Models\Template::where('name', 'like', '%Paladium%')->first();
if ($template) {
    echo "Paladium Template:\n";
    echo "ID: {$template->id}\n";
    echo "invitation_id: {$template->invitation_id}\n";
    echo "demo_views: {$template->demo_views}\n";
    echo "total_invitation_views: {$template->total_invitation_views}\n";
    
    $inv = App\Models\Invitation::find($template->invitation_id);
    if ($inv) {
        echo "Linked Invitation: {$inv->id} - {$inv->title}\n";
        echo "Invitation views via visitors count: " . App\Models\InvitationVisitor::where('invitation_id', $inv->id)->count() . "\n";
    }
} else {
    echo "Paladium template not found\n";
}
