<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

try {
    $inv = \App\Models\Invitation::find(10);
    if ($inv) {
        $config = $inv->canvas_config;
        $modified = false;

        // Clean up corrupted layers in desktop
        if (isset($config['global_settings']['desktop_layers'])) {
            $cleaned = array_filter($config['global_settings']['desktop_layers'], function($layer) {
                return isset($layer['type']) && in_array($layer['type'], ['group', 'image', 'text', 'shape', 'lottie', 'frame', 'interactive_map', 'countdown', 'music_player', 'dynamic_guest_name', 'audio', 'canvas_group']);
            });
            if (count($cleaned) !== count($config['global_settings']['desktop_layers'])) {
                $config['global_settings']['desktop_layers'] = array_values($cleaned);
                $modified = true;
            }
            
            // Clean up inside groups
            foreach ($config['global_settings']['desktop_layers'] as &$layer) {
                if (isset($layer['children']) && is_array($layer['children'])) {
                    $cleanedChildren = array_filter($layer['children'], function($child) {
                        return isset($child['type']);
                    });
                    if (count($cleanedChildren) !== count($layer['children'])) {
                        $layer['children'] = array_values($cleanedChildren);
                        $modified = true;
                    }
                }
            }
        }

        // Clean up corrupted layers in sections
        if (isset($config['sections'])) {
            foreach ($config['sections'] as &$section) {
                if (isset($section['layers'])) {
                    $cleaned = array_filter($section['layers'], function($layer) {
                        return isset($layer['type']);
                    });
                    if (count($cleaned) !== count($section['layers'])) {
                        $section['layers'] = array_values($cleaned);
                        $modified = true;
                    }

                    // Clean up inside groups
                    foreach ($section['layers'] as &$layer) {
                        if (isset($layer['children']) && is_array($layer['children'])) {
                            $cleanedChildren = array_filter($layer['children'], function($child) {
                                return isset($child['type']);
                            });
                            if (count($cleanedChildren) !== count($layer['children'])) {
                                $layer['children'] = array_values($cleanedChildren);
                                $modified = true;
                            }
                        }
                    }
                }
            }
        }

        if ($modified) {
            $inv->canvas_config = $config;
            $inv->save();
            echo "Canvas cleaned. ";
        } else {
            echo "No corrupt layers found. ";
        }
    } else {
        echo "Invitation 10 not found. ";
    }

    // Update the packages in database
    $package = \App\Models\Package::where('name', 'Basic')->first();
    if ($package) {
        $features = $package->features;
        if (is_string($features)) $features = json_decode($features, true);
        if (is_array($features)) {
            $updated = false;
            $features = array_map(function($f) use (&$updated) {
                if (strpos($f, 'Maksimal 5 Foto') !== false) {
                    $updated = true;
                    return str_replace('Maksimal 5 Foto', 'Maksimal 10 Foto', $f);
                }
                return $f;
            }, $features);
            
            if ($updated) {
                $package->features = $features;
                $package->save();
                echo "Package fixed. ";
            } else {
                echo "Package already fixed or 5 Foto not found. ";
            }
        }
    }

    echo "Done!";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
