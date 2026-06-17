<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Delete dummy templates that don't have an invitation_id
\App\Models\Template::whereNull('invitation_id')->delete();

echo "Deleted dummy templates.";
