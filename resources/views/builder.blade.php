<!DOCTYPE html>
<html lang="id">
<head>
    <link rel="icon" href="/logo1.png" type="image/png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Visual Builder - {{ $invitation->title }}</title>
    
    <script>
        window.ASSET_URL = '{{ str_replace('test.txt', '', Storage::url('test.txt')) }}';
        // Injeksi ID Undangan & Data JSON awal ke React
        window.__INVITATION_ID__ = {{ $invitation->id }};
        window.__ORDER_ID__ = {{ $invitation->order_id ? $invitation->order_id : 'null' }};
        window.__INVITATION_SLUG__ = "{{ $invitation->slug }}";
        window.__INVITATION_STATUS__ = "{{ $invitation->status }}";
        window.__INVITATION_EXPIRES_AT__ = "{{ $invitation->expires_at }}";
        window.__CANVAS_DATA__ = @json($invitation->canvas_config ?? ['sections' => [], 'global_settings' => []]);
    </script>
    
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/Builder/BuilderApp.jsx'])
    
    <style>
        body, html { margin: 0; padding: 0; background-color: #0f172a; overflow-x: hidden; font-family: 'Inter', sans-serif; }
    </style>
</head>
<body>
    <div id="builder-root"></div>
</body>
</html>
