<?php $__env->startSection('content'); ?>
<div class="min-h-screen bg-sand flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 text-center p-10">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        
        <h2 class="text-3xl font-serif text-brand-900 mb-4">Terima Kasih!</h2>
        <p class="text-gray-600 mb-8">Data form dan aset Anda untuk pesanan <strong><?php echo e($order->template->name ?? 'Desain'); ?></strong> telah kami terima dengan baik. Tim kami atau sistem akan segera memproses pembuatan desain Anda.</p>
        
        <a href="<?php echo e(url('/')); ?>" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-brand-800 hover:bg-brand-900 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
            Kembali ke Beranda
        </a>
    </div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.main', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\Undangan\resources\views/client-form/success.blade.php ENDPATH**/ ?>