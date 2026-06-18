<x-filament-widgets::widget>
    <x-filament::section>
        <div class="flex items-center justify-between mb-4">
            <div>
                <h2 class="text-xl font-bold tracking-tight">Tabungan Balik Modal (BEP)</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">Target Harian: Rp {{ number_format($dailyTarget, 0, ',', '.') }} | Hari ke-{{ $daysPassed }}</p>
            </div>
            <div>
                {{ $this->depositAction }}
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Target</p>
                <p class="text-2xl font-bold">Rp {{ number_format($totalTarget, 0, ',', '.') }}</p>
            </div>
            <div class="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500/20">
                <p class="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">Terkumpul ({{ number_format($progress, 1) }}%)</p>
                <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">Rp {{ number_format($totalCollected, 0, ',', '.') }}</p>
            </div>
            <div class="p-4 rounded-xl bg-warning-50 dark:bg-warning-900/20 ring-1 ring-warning-500/20">
                <p class="text-sm font-medium text-warning-600 dark:text-warning-400 mb-1">Sisa Target Keseluruhan</p>
                <p class="text-2xl font-bold text-warning-600 dark:text-warning-400">Rp {{ number_format($sisaTarget, 0, ',', '.') }}</p>
            </div>
        </div>

        <div class="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 overflow-hidden mb-2">
            <div class="bg-primary-600 h-4 rounded-full transition-all duration-500" style="width: {{ $progress }}%"></div>
        </div>
        <p class="text-sm text-right text-gray-500 dark:text-gray-400">Sisa Kas Tersedia: <span class="font-bold">Rp {{ number_format($availableCash, 0, ',', '.') }}</span></p>

    </x-filament::section>

    <x-filament-actions::modals />
</x-filament-widgets::widget>
