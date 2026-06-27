<div class="flex flex-col h-full group pb-1">
    @php
        $categoryName = strtolower($getRecord()->category?->name ?? $getRecord()->service?->title ?? '');
        
        $style = match(true) {
            str_contains($categoryName, 'foto') => ['icon' => 'heroicon-s-photo', 'color' => 'text-pink-600 dark:text-pink-400', 'bg' => 'bg-pink-100 dark:bg-pink-500/20'],
            str_contains($categoryName, 'web') => ['icon' => 'heroicon-s-globe-alt', 'color' => 'text-blue-600 dark:text-blue-400', 'bg' => 'bg-blue-100 dark:bg-blue-500/20'],
            str_contains($categoryName, 'video') => ['icon' => 'heroicon-s-video-camera', 'color' => 'text-purple-600 dark:text-purple-400', 'bg' => 'bg-purple-100 dark:bg-purple-500/20'],
            str_contains($categoryName, 'minuman') || str_contains($categoryName, 'teh') || str_contains($categoryName, 'kopi') => ['icon' => 'heroicon-s-beaker', 'color' => 'text-amber-600 dark:text-amber-400', 'bg' => 'bg-amber-100 dark:bg-amber-500/20'],
            str_contains($categoryName, 'makanan') || str_contains($categoryName, 'f&b') => ['icon' => 'heroicon-s-cake', 'color' => 'text-orange-600 dark:text-orange-400', 'bg' => 'bg-orange-100 dark:bg-orange-500/20'],
            str_contains($categoryName, 'souvenir') || str_contains($categoryName, 'merchandise') => ['icon' => 'heroicon-s-gift', 'color' => 'text-emerald-600 dark:text-emerald-400', 'bg' => 'bg-emerald-100 dark:bg-emerald-500/20'],
            default => ['icon' => 'heroicon-s-tag', 'color' => 'text-primary-600 dark:text-primary-400', 'bg' => 'bg-primary-100 dark:bg-primary-500/20'],
        };
        
        $price = 'Rp ' . number_format($getRecord()->price ?? 0, 0, ',', '.');
    @endphp

    <div class="flex items-start justify-between mb-4">
        <div class="flex items-center justify-center w-12 h-12 rounded-2xl {{ $style['bg'] }} {{ $style['color'] }} shadow-sm transition-transform group-hover:scale-105">
            @svg($style['icon'], 'w-6 h-6')
        </div>
        <span class="px-3 py-1 text-xs font-bold rounded-full {{ $style['bg'] }} {{ $style['color'] }}">
            {{ $getRecord()->category?->name ?? $getRecord()->service?->title }}
        </span>
    </div>

    <div class="flex-1 mt-2">
        <h3 class="text-xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">
            {{ $getRecord()->name }}
        </h3>
        
        @if($getRecord()->description)
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {{ $getRecord()->description }}
            </p>
        @else
            <div class="h-5 mt-1"></div>
        @endif
    </div>

    <div class="mt-5">
        <span class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            {{ $price }}
        </span>
    </div>
</div>
