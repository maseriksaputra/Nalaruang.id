<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <title>Visual Builder - <?php echo e($invitation->title); ?></title>
    
    <script>
        // Injeksi ID Undangan & Data JSON awal ke React
        window.__INVITATION_ID__ = <?php echo e($invitation->id); ?>;
        window.__ORDER_ID__ = <?php echo e($invitation->order_id ? $invitation->order_id : 'null'); ?>;
        window.__INVITATION_SLUG__ = "<?php echo e($invitation->slug); ?>";
        window.__INVITATION_STATUS__ = "<?php echo e($invitation->status); ?>";
        window.__INVITATION_EXPIRES_AT__ = "<?php echo e($invitation->expires_at); ?>";
        window.__CANVAS_DATA__ = <?php echo json_encode($invitation->canvas_config ?? ['sections' => [], 'global_settings' => []], 512) ?>;
    </script>
    
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/Builder/BuilderApp.jsx']); ?>
    
    <style>
        body, html { margin: 0; padding: 0; background-color: #0f172a; overflow-x: hidden; font-family: 'Inter', sans-serif; }
    </style>
</head>
<body>
    <div id="builder-root"></div>
</body>
</html>
<?php /**PATH D:\laragon\www\Undangan\resources\views/builder.blade.php ENDPATH**/ ?>