<div class="flex items-start gap-4 p-2">
    @php
        $categoryName = strtolower($getRecord()->category?->name ?? $getRecord()->service?->title ?? '');
        $icon = match(true) {
            str_contains($categoryName, 'foto') => 'heroicon-o-photo',
            str_contains($categoryName, 'web') => 'heroicon-o-globe-alt',
            str_contains($categoryName, 'video') => 'heroicon-o-video-camera',
            str_contains($categoryName, 'minuman') || str_contains($categoryName, 'teh') || str_contains($categoryName, 'kopi') => 'heroicon-o-beaker',
            str_contains($categoryName, 'makanan') || str_contains($categoryName, 'f&b') => 'heroicon-o-cake',
            str_contains($categoryName, 'souvenir') || str_contains($categoryName, 'merchandise') => 'heroicon-o-gift',
            default => 'heroicon-o-tag',
        };
        $price = 'Rp ' . number_format($getRecord()->price ?? 0, 0, ',', '.');
    @endphp

    <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-500">
        @svg($icon, 'w-6 h-6')
    </div>

    <div class="flex flex-col flex-1">
        <h3 class="text-base font-bold text-gray-900 dark:text-white leading-tight">
            {{ $getRecord()->name }}
        </h3>
        
        @if($getRecord()->description)
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ $getRecord()->description }}
            </p>
        @endif

        <div class="mt-2">
            <span class="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-600 ring-1 ring-inset ring-primary-500/20 dark:bg-primary-400/10 dark:text-primary-400 dark:ring-primary-400/30">
                {{ $getRecord()->category?->name ?? $getRecord()->service?->title }}
            </span>
        </div>

        <div class="mt-3">
            <span class="text-lg font-black text-green-600 dark:text-green-400">
                {{ $price }}
            </span>
        </div>
    </div>
</div>
