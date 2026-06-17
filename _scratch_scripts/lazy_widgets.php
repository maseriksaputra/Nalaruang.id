<?php

$dir = __DIR__ . '/app/Filament/Widgets';
$files = glob($dir . '/*.php');

foreach ($files as $file) {
    $content = file_get_contents($file);
    
    // Only add if it extends a widget and doesn't already have $isLazy
    if (strpos($content, '$isLazy') === false) {
        // Find the class definition and insert after the first opening brace
        $content = preg_replace('/(class\s+\w+\s+extends\s+\w+\s*\{)/i', "$1\n    protected static bool \$isLazy = true;\n", $content);
        file_put_contents($file, $content);
        echo "Updated " . basename($file) . "\n";
    }
}

echo "Done.\n";
