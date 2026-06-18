<!DOCTYPE html>
<html lang="id">
<head>
    <link rel="icon" href="/logo1.png?v=2" type="image/png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title><?php echo e($invitation->title ?? 'Undangan'); ?></title>
    
    <!-- Inject JSON Data untuk dikonsumsi oleh React -->
    <script>
        window.__INVITATION_DATA__ = <?php echo json_encode($invitation->canvas_config ?? ['sections' => []], 15, 512) ?>;
    </script>
    
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/Viewer/ViewerApp.jsx']); ?>
    
    <style>
        body, html { margin: 0; padding: 0; overflow-x: hidden; background-color: #1a1a1a; }
    </style>
</head>
<body>
    <div id="viewer-root"></div>
</body>
</html>
<?php /**PATH D:\laragon\www\Undangan\resources\views/viewer.blade.php ENDPATH**/ ?>