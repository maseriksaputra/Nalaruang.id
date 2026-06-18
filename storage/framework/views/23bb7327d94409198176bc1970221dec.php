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
    <?php if (isset($component)) { $__componentOriginalee08b1367eba38734199cf7829b1d1e9 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalee08b1367eba38734199cf7829b1d1e9 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'filament::components.section.index','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('filament::section'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
        <div class="flex items-center justify-between mb-4">
            <div>
                <h2 class="text-xl font-bold tracking-tight">Tabungan Balik Modal (BEP)</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">Target Harian: Rp <?php echo e(number_format($dailyTarget, 0, ',', '.')); ?> | Hari ke-<?php echo e($daysPassed); ?></p>
            </div>
            <div>
                <?php echo e($this->depositAction); ?>

            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Target</p>
                <p class="text-2xl font-bold">Rp <?php echo e(number_format($totalTarget, 0, ',', '.')); ?></p>
            </div>
            <div class="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500/20">
                <p class="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">Terkumpul (<?php echo e(number_format($progress, 1)); ?>%)</p>
                <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">Rp <?php echo e(number_format($totalCollected, 0, ',', '.')); ?></p>
            </div>
            <div class="p-4 rounded-xl bg-warning-50 dark:bg-warning-900/20 ring-1 ring-warning-500/20">
                <p class="text-sm font-medium text-warning-600 dark:text-warning-400 mb-1">Sisa Target Keseluruhan</p>
                <p class="text-2xl font-bold text-warning-600 dark:text-warning-400">Rp <?php echo e(number_format($sisaTarget, 0, ',', '.')); ?></p>
            </div>
        </div>

        <div class="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 overflow-hidden mb-2">
            <div class="bg-primary-600 h-4 rounded-full transition-all duration-500" style="width: <?php echo e($progress); ?>%"></div>
        </div>
        <p class="text-sm text-right text-gray-500 dark:text-gray-400">Sisa Kas Tersedia: <span class="font-bold">Rp <?php echo e(number_format($availableCash, 0, ',', '.')); ?></span></p>

     <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalee08b1367eba38734199cf7829b1d1e9)): ?>
<?php $attributes = $__attributesOriginalee08b1367eba38734199cf7829b1d1e9; ?>
<?php unset($__attributesOriginalee08b1367eba38734199cf7829b1d1e9); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalee08b1367eba38734199cf7829b1d1e9)): ?>
<?php $component = $__componentOriginalee08b1367eba38734199cf7829b1d1e9; ?>
<?php unset($__componentOriginalee08b1367eba38734199cf7829b1d1e9); ?>
<?php endif; ?>

    <?php if (isset($component)) { $__componentOriginal028e05680f6c5b1e293abd7fbe5f9758 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal028e05680f6c5b1e293abd7fbe5f9758 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'filament-actions::components.modals','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('filament-actions::modals'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal028e05680f6c5b1e293abd7fbe5f9758)): ?>
<?php $attributes = $__attributesOriginal028e05680f6c5b1e293abd7fbe5f9758; ?>
<?php unset($__attributesOriginal028e05680f6c5b1e293abd7fbe5f9758); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal028e05680f6c5b1e293abd7fbe5f9758)): ?>
<?php $component = $__componentOriginal028e05680f6c5b1e293abd7fbe5f9758; ?>
<?php unset($__componentOriginal028e05680f6c5b1e293abd7fbe5f9758); ?>
<?php endif; ?>
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
<?php /**PATH D:\laragon\www\Undangan\resources\views/filament/widgets/bep-overview-widget.blade.php ENDPATH**/ ?>