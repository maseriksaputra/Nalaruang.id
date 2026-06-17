<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$t = \App\Models\Template::all();
foreach($t as $template) {
    echo "ID: " . $template->id . " Name: " . $template->name . " Service ID: " . $template->service_id . " Invitation ID: " . $template->invitation_id . "\n";
}
