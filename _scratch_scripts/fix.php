<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$s = \App\Models\Service::where('slug', 'event-digital')->first();
if (!$s) {
    $s = \App\Models\Service::create(['slug' => 'event-digital', 'title' => 'Event Digital']);
}
$s2 = \App\Models\Service::where('slug', 'undangan-website')->first();
if ($s2) {
    \App\Models\Template::where('service_id', $s2->id)->update(['service_id' => $s->id]);
    \App\Models\Order::where('service_id', $s2->id)->update(['service_id' => $s->id]); // just in case
    // $s2->delete(); // Optional: delete the unused service
}
echo "Fixed DB records";
