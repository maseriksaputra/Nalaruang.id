<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$service = \App\Models\Service::firstOrCreate(
    ['slug' => 'event-digital'],
    ['title' => 'Event Digital', 'description' => 'Layanan Undangan Digital']
);

$invitations = \App\Models\Invitation::where('is_template', true)->get();

$count = 0;
foreach ($invitations as $invitation) {
    $exists = \App\Models\Template::where('invitation_id', $invitation->id)->exists();
    if (!$exists) {
        \App\Models\Template::create([
            'invitation_id' => $invitation->id,
            'service_id' => $service->id,
            'name' => $invitation->title ?: 'Template Builder',
            'price' => 0,
            'category' => $invitation->category ?: 'Event Digital',
            'is_active' => true,
            'sort_order' => 0,
            'form_schema' => [
                [
                    'field_name' => 'Foto Utama',
                    'type' => 'image',
                    'is_required' => false,
                    'max_files' => 10
                ],
                [
                    'field_name' => 'Musik Latar',
                    'type' => 'audio',
                    'is_required' => false
                ],
                [
                    'field_name' => 'Data Teks & Link',
                    'type' => 'textarea',
                    'is_required' => false
                ]
            ]
        ]);
        $count++;
    }
}
echo "Migrated $count templates to the catalog.";
