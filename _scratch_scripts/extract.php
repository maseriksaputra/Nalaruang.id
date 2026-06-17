<?php
$html = file_get_contents('backup_html/web.html');
preg_match('/(.*?)<!-- Hero Section.*?-->(.*?)<!-- Floating Help Button -->(.*)/s', $html, $matches);
$main = $matches[1] . "    @yield('content')\n\n    <!-- Floating Help Button -->" . $matches[3];
$home = "@extends('layouts.main')\n@section('content')\n\n    <!-- Hero Section dengan Image Slideshow Geser Kanan-Kiri -->" . $matches[2] . "@endsection\n";
file_put_contents('resources/views/layouts/main.blade.php', $main);
file_put_contents('resources/views/home.blade.php', $home);
echo "Templates extracted.";
