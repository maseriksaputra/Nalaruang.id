@php
    $record = $getRecord();
    $isIncome = $record->type === 'income';
    $amountFormatted = 'Rp ' . number_format(abs($record->amount), 0, ',', '.');
    $timeFormatted = \Carbon\Carbon::parse($record->created_at)->format('H:i') . ' WIB';
    $categoryText = 'Kategori ' . ($record->category ?? '-') . ' • Kas ' . ($isIncome ? 'Masuk' : 'Keluar');
@endphp

<!-- Item Transaksi -->
<div class="flex items-center justify-between px-4 py-3 bg-white w-full">
    <!-- Kiri: Icon & Judul -->
    <div class="flex items-center">
        <!-- Icon Masuk / Keluar -->
        @if($isIncome)
            <div class="flex items-center justify-center w-8 h-8 bg-green-50 text-green-500 rounded-full mr-3 shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
        @else
            <div class="flex items-center justify-center w-8 h-8 bg-red-50 text-red-500 rounded-full mr-3 shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </div>
        @endif
        
        <div>
            <p class="text-sm font-medium text-gray-900">{{ $record->description }}</p>
            <p class="text-xs text-gray-500">{{ $categoryText }}</p>
        </div>
    </div>
    
    <!-- Kanan: Nominal & Jam -->
    <div class="flex items-center text-right shrink-0">
        <div class="mr-4">
            <p class="text-sm font-bold {{ $isIncome ? 'text-green-600' : 'text-red-500' }}">{{ $amountFormatted }}</p>
            <p class="text-xs text-gray-400">{{ $timeFormatted }}</p>
        </div>
    </div>
</div>
