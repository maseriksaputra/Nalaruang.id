<?php
$content = file_get_contents('d:/laragon/www/Undangan/resources/views/service-show.blade.php');

// Reduce header padding
$content = str_replace(
    'class="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-brand-900 overflow-hidden"',
    'class="relative pt-24 pb-12 lg:pt-32 lg:pb-12 bg-brand-900 overflow-hidden"',
    $content
);

// We need to reorder the sections.
// Let's split by HTML comments:
// <!-- Service Header Section -->
// <!-- Cara Kerja Section -->
// <!-- Etalase Template Section -->
// <!-- Packages / Pricing Section -->
// <!-- Custom Request Banner -->

$pattern_header = '/(<!-- Service Header Section -->.*?<\/section>)\s*(?=<!--)/s';
$pattern_cara_kerja = '/(<!-- Cara Kerja Section -->.*?<\/section>)\s*(?=<!--)/s';
$pattern_etalase = '/(<!-- Etalase Template Section -->.*?<\/section>)\s*(?=<!--)/s';
$pattern_packages = '/(<!-- Packages \/ Pricing Section -->.*?<\/section>)\s*(?=<!--)/s';

preg_match($pattern_header, $content, $match_header);
preg_match($pattern_cara_kerja, $content, $match_cara_kerja);
preg_match($pattern_etalase, $content, $match_etalase);
preg_match($pattern_packages, $content, $match_packages);

if (!empty($match_header) && !empty($match_cara_kerja) && !empty($match_etalase) && !empty($match_packages)) {
    // Rebuild the file
    $top = substr($content, 0, strpos($content, '<!-- Service Header Section -->'));
    
    // The banner is the last section, we can just replace everything from Service Header to end of Packages
    $pattern_all = '/<!-- Service Header Section -->.*?<!-- Custom Request Banner -->/s';
    
    $new_order = 
        $match_header[1] . "\n\n" .
        $match_etalase[1] . "\n\n" .
        $match_packages[1] . "\n\n" .
        $match_cara_kerja[1] . "\n\n" .
        "<!-- Custom Request Banner -->";
        
    $content = preg_replace($pattern_all, $new_order, $content);
    
    file_put_contents('d:/laragon/www/Undangan/resources/views/service-show.blade.php', $content);
    echo "Layout reordered successfully!";
} else {
    echo "Failed to match sections.";
}
