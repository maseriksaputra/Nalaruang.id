<div class="flex flex-col h-full justify-between gap-3 pt-1">
    @php
        $categoryName = strtolower($getRecord()->category?->name ?? $getRecord()->service?->title ?? '');
        
        $style = match(true) {
            str_contains($categoryName, 'foto') => [
                'icon' => 'heroicon-s-photo', 
                'gradient' => 'bg-gradient-to-br from-pink-400 to-rose-500',
                'border' => 'border-pink-300',
                'iconColor' => 'text-white',
                'badgeBg' => 'bg-pink-100 dark:bg-pink-500/20',
                'badgeText' => 'text-pink-700 dark:text-pink-400',
                'priceColor' => 'text-rose-600 dark:text-rose-400',
            ],
            str_contains($categoryName, 'web') => [
                'icon' => 'heroicon-s-globe-alt', 
                'gradient' => 'bg-gradient-to-br from-cyan-400 to-blue-500',
                'border' => 'border-cyan-300',
                'iconColor' => 'text-white',
                'badgeBg' => 'bg-blue-100 dark:bg-blue-500/20',
                'badgeText' => 'text-blue-700 dark:text-blue-400',
                'priceColor' => 'text-blue-600 dark:text-blue-400',
            ],
            str_contains($categoryName, 'video') => [
                'icon' => 'heroicon-s-video-camera', 
                'gradient' => 'bg-gradient-to-br from-fuchsia-400 to-purple-500',
                'border' => 'border-fuchsia-300',
                'iconColor' => 'text-white',
                'badgeBg' => 'bg-purple-100 dark:bg-purple-500/20',
                'badgeText' => 'text-purple-700 dark:text-purple-400',
                'priceColor' => 'text-purple-600 dark:text-purple-400',
            ],
            str_contains($categoryName, 'minuman') || str_contains($categoryName, 'teh') || str_contains($categoryName, 'kopi') => [
                'icon' => 'heroicon-s-beaker', 
                'gradient' => 'bg-gradient-to-br from-yellow-300 to-amber-500',
                'border' => 'border-yellow-200',
                'iconColor' => 'text-white',
                'badgeBg' => 'bg-amber-100 dark:bg-amber-500/20',
                'badgeText' => 'text-amber-700 dark:text-amber-400',
                'priceColor' => 'text-amber-600 dark:text-amber-400',
            ],
            str_contains($categoryName, 'makanan') || str_contains($categoryName, 'f&b') => [
                'icon' => 'heroicon-s-cake', 
                'gradient' => 'bg-gradient-to-br from-orange-400 to-red-500',
                'border' => 'border-orange-300',
                'iconColor' => 'text-white',
                'badgeBg' => 'bg-orange-100 dark:bg-orange-500/20',
                'badgeText' => 'text-orange-700 dark:text-orange-400',
                'priceColor' => 'text-red-600 dark:text-red-400',
            ],
            str_contains($categoryName, 'souvenir') || str_contains($categoryName, 'merchandise') => [
                'icon' => 'heroicon-s-gift', 
                'gradient' => 'bg-gradient-to-br from-emerald-400 to-teal-500',
                'border' => 'border-emerald-300',
                'iconColor' => 'text-white',
                'badgeBg' => 'bg-emerald-100 dark:bg-emerald-500/20',
                'badgeText' => 'text-emerald-700 dark:text-emerald-400',
                'priceColor' => 'text-teal-600 dark:text-teal-400',
            ],
            default => [
                'icon' => 'heroicon-s-tag', 
                'gradient' => 'bg-gradient-to-br from-gray-400 to-slate-600',
                'border' => 'border-gray-300',
                'iconColor' => 'text-white',
                'badgeBg' => 'bg-gray-100 dark:bg-gray-800',
                'badgeText' => 'text-gray-700 dark:text-gray-300',
                'priceColor' => 'text-slate-700 dark:text-slate-300',
            ],
        };
        
        $price = 'Rp ' . number_format($getRecord()->price ?? 0, 0, ',', '.');
    @endphp

    <!-- Top Area: Icon and Details -->
    <div class="flex items-start gap-4">
        <!-- Vibrant Icon Box -->
        <div class="shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl {{ $style['gradient'] }} shadow-md border {{ $style['border'] }} transition-transform hover:scale-105 hover:rotate-3 duration-300">
            @svg($style['icon'], 'w-7 h-7 ' . $style['iconColor'])
        </div>

        <!-- Details -->
        <div class="flex flex-col min-w-0 flex-1 pt-0.5">
            <div class="flex items-center gap-2 mb-1.5">
                <span class="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider {{ $style['badgeBg'] }} {{ $style['badgeText'] }}">
                    {{ $getRecord()->category?->name ?? $getRecord()->service?->title ?? 'Umum' }}
                </span>
            </div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white leading-tight truncate" title="{{ $getRecord()->name }}">
                {{ $getRecord()->name }}
            </h3>
            @if($getRecord()->description)
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 font-medium" title="{{ $getRecord()->description }}">
                    {{ $getRecord()->description }}
                </p>
            @endif
        </div>
    </div>

    <!-- Bottom Area: Price -->
    <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/60 flex items-end justify-between">
        <div class="flex flex-col">
            <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Harga</span>
            <span class="text-xl font-black {{ $style['priceColor'] }} tracking-tight">
                {{ $price }}
            </span>
        </div>
    </div>
</div>
