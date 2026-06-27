<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$invitations = \App\Models\Invitation::all();
foreach($invitations as $t) {
    echo $t->title . " - is_temp: " . $t->is_template . "\n";
}
