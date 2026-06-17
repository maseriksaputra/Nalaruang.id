<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <title>Nalaruang.id</title>
    
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/Dashboard/PortalApp.jsx']); ?>
    <script>
        // Check local storage for theme
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    </script>
</head>
<body class="bg-gray-50 text-gray-900 dark:bg-[#0f172a] dark:text-gray-100 antialiased transition-colors duration-200 font-sans">
    <div id="portal-root"></div>
</body>
</html>
<?php /**PATH D:\laragon\www\Undangan\resources\views/invitation-portal.blade.php ENDPATH**/ ?>