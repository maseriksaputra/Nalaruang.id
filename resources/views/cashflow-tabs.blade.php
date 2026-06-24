<template x-teleport=".fi-ta-header-toolbar">
    <div class="flex items-center gap-2 order-first w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
        @php
            $activeCategory = data_get($livewire->tableFilters, 'category.value');
        @endphp
        <button wire:click="$set('tableFilters.category.value', null)" 
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-all shrink-0
                       {{ is_null($activeCategory) ? 'bg-primary-600 text-white border border-primary-600' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50' }}">
            Semua
        </button>
        <button wire:click="$set('tableFilters.category.value', 'F&B')" 
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-all shrink-0
                       {{ $activeCategory === 'F&B' ? 'bg-primary-600 text-white border border-primary-600' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50' }}">
            F&B
        </button>
        <button wire:click="$set('tableFilters.category.value', 'ATK')" 
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-all shrink-0
                       {{ $activeCategory === 'ATK' ? 'bg-primary-600 text-white border border-primary-600' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50' }}">
            ATK
        </button>
        <button wire:click="$set('tableFilters.category.value', 'Printing')" 
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-all shrink-0
                       {{ $activeCategory === 'Printing' ? 'bg-primary-600 text-white border border-primary-600' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50' }}">
            Printing
        </button>
        <button wire:click="$set('tableFilters.category.value', 'Digital')" 
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-all shrink-0
                       {{ $activeCategory === 'Digital' ? 'bg-primary-600 text-white border border-primary-600' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50' }}">
            Digital
        </button>
        <button wire:click="$set('tableFilters.category.value', 'Souvenir')" 
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-all shrink-0
                       {{ $activeCategory === 'Souvenir' ? 'bg-primary-600 text-white border border-primary-600' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50' }}">
            Souvenir
        </button>
    </div>
</template>
