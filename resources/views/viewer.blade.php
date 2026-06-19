<!DOCTYPE html>
<html lang="id">
<head>
    <link rel="icon" href="/logo1.png?v=2" type="image/png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>{{ $invitation->title ?? 'Undangan' }}</title>
    
    <!-- Inject JSON Data untuk dikonsumsi oleh React -->
    <script>
        window.__INVITATION_DATA__ = @json($invitation->canvas_config ?? ['sections' => []]);
        window.__IS_PREVIEW__ = {{ request()->has('preview') ? 'true' : 'false' }};
    </script>
    
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/Viewer/ViewerApp.jsx'])
    
    <style>
        body, html { margin: 0; padding: 0; overflow-x: hidden; background-color: #1a1a1a; }
    </style>
</head>
<body>
    <div id="viewer-root"></div>
</body>
</html>
