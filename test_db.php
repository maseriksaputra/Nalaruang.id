<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$invitation = App\Models\Invitation::find(12);
file_put_contents('invitation_12.json', json_encode($invitation->toArray(), JSON_PRETTY_PRINT));
