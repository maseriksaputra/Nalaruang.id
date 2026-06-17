<?php
    $stats = $this->getStatsData();
?>
<?php if (isset($component)) { $__componentOriginalb525200bfa976483b4eaa0b7685c6e24 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalb525200bfa976483b4eaa0b7685c6e24 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'filament-widgets::components.widget','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('filament-widgets::widget'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Card Pemasukan -->
        <div class="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div class="flex items-center justify-center w-12 h-12 bg-green-50 text-green-500 rounded-full mr-4">
                <!-- Icon Arrow Up Right -->
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M7 7h10v10"></path></svg>
            </div>
            <div>
                <p class="text-xs text-gray-500 font-medium uppercase">Total Pemasukan</p>
                <p class="text-xl font-bold text-gray-900">Rp <?php echo e(number_format($stats['income'], 0, ',', '.')); ?></p>
                <p class="text-[10px] text-green-500 mt-1 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    Dari data yang sedang disaring
                </p>
            </div>
        </div>

        <!-- Card Pengeluaran -->
        <div class="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div class="flex items-center justify-center w-12 h-12 bg-red-50 text-red-500 rounded-full mr-4">
                <!-- Icon Arrow Down Right -->
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 7L7 17M17 7v10H7"></path></svg>
            </div>
            <div>
                <p class="text-xs text-gray-500 font-medium uppercase">Total Pengeluaran</p>
                <p class="text-xl font-bold text-gray-900">Rp <?php echo e(number_format($stats['expense'], 0, ',', '.')); ?></p>
                <p class="text-[10px] text-red-500 mt-1 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                    Dari data yang sedang disaring
                </p>
            </div>
        </div>

        <!-- Card Laba Bersih -->
        <div class="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div class="flex items-center justify-center w-12 h-12 <?php echo e($stats['net'] >= 0 ? 'bg-indigo-50 text-indigo-500' : 'bg-red-50 text-red-500'); ?> rounded-full mr-4">
                <!-- Icon Wallet -->
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            </div>
            <div>
                <p class="text-xs text-gray-500 font-medium uppercase">Laba Bersih (Nett)</p>
                <p class="text-xl font-bold text-gray-900"><?php echo e($stats['net'] < 0 ? '-' : ''); ?>Rp <?php echo e(number_format(abs($stats['net']), 0, ',', '.')); ?></p>
                <p class="text-[10px] <?php echo e($stats['net'] >= 0 ? 'text-indigo-500' : 'text-red-500'); ?> mt-1 flex items-center">
                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($stats['net'] >= 0): ?>
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    <?php else: ?>
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                    Pemasukan - Pengeluaran
                </p>
            </div>
        </div>
    </div>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalb525200bfa976483b4eaa0b7685c6e24)): ?>
<?php $attributes = $__attributesOriginalb525200bfa976483b4eaa0b7685c6e24; ?>
<?php unset($__attributesOriginalb525200bfa976483b4eaa0b7685c6e24); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalb525200bfa976483b4eaa0b7685c6e24)): ?>
<?php $component = $__componentOriginalb525200bfa976483b4eaa0b7685c6e24; ?>
<?php unset($__componentOriginalb525200bfa976483b4eaa0b7685c6e24); ?>
<?php endif; ?>
<?php /**PATH D:\laragon\www\Undangan\resources\views/filament/widgets/cashflow-stats.blade.php ENDPATH**/ ?>