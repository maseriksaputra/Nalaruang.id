<?php

return [
    'temporary_file_upload' => [
        'disk' => 'local',        // Force temporary uploads to go to the local VPS disk instead of S3
        'rules' => null,          // Use default rules
        'directory' => null,      // Use default directory
        'middleware' => null,     // Use default middleware
        'preview_mimes' => [      // Use default preview mimes
            'png', 'gif', 'bmp', 'svg', 'wav', 'mp4',
            'mov', 'avi', 'wmv', 'mp3', 'm4a',
            'jpg', 'jpeg', 'mpga', 'webp', 'wma',
        ],
        'max_upload_time' => 5,   // Use default
    ],
];
