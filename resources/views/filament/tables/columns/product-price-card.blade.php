<div class="flex items-center gap-3 p-1">
    @php
        $categoryName = strtolower($getRecord()->category?->name ?? $getRecord()->service?->title ?? '');
        $icon = match(true) {
            str_contains($categoryName, 'foto') => 'heroicon-s-photo',
            str_contains($categoryName, 'web') => 'heroicon-s-globe-alt',
            str_contains($categoryName, 'video') => 'heroicon-s-video-camera',
            str_contains($categoryName, 'minuman') || str_contains($categoryName, 'teh') || str_contains($categoryName, 'kopi') => 'heroicon-s-beaker',
            str_contains($categoryName, 'makanan') || str_contains($categoryName, 'f&b') => 'heroicon-s-cake',
            str_contains($categoryName, 'souvenir') || str_contains($categoryName, 'merchandise') => 'heroicon-s-gift',
            default => 'heroicon-s-tag',
        };
        $price = 'Rp ' . number_format($getRecord()->price ?? 0, 0, ',', '.');
    @endphp

    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-500">
        @svg($icon, 'w-5 h-5')
    </div>

    <div class="flex flex-col flex-1 min-w-0">
        <h3 class="text-sm font-bold text-gray-900 dark:text-white truncate">
            {{ $getRecord()->name }}
        </h3>
        
        <div class="flex items-center gap-2 mt-0.5">
            @if($getRecord()->description)
                <span class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ $getRecord()->description }}
                </span>
                <span class="text-gray-300 dark:text-gray-600">&bull;</span>
            @endif
            <span class="text-xs font-medium text-primary-600 dark:text-primary-400 truncate">
                {{ $getRecord()->category?->name ?? $getRecord()->service?->title }}
            </span>
        </div>
    </div>

    <div class="text-right whitespace-nowrap pl-4">
        <span class="text-base font-black text-green-600 dark:text-green-400">
            {{ $price }}
        </span>
    </div>
</div>
