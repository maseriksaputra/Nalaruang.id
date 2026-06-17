<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$templates = \App\Models\Template::whereNotNull('invitation_id')->get();
foreach ($templates as $t) {
    $inv = \App\Models\Invitation::find($t->invitation_id);
    if ($inv) {
        $t->preview_url = url('/' . $inv->slug);
        $t->save();
        echo "Updated template ID {$t->id} with preview_url {$t->preview_url}\n";
    }
}
