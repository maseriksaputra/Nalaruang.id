<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

use Carbon\Carbon;

class StatsOverview extends BaseWidget
{
    use \Filament\Widgets\Concerns\InteractsWithPageFilters;
    use \App\Filament\Traits\AppliesDashboardFilters;

    protected static ?int $sort = 1;
    protected static bool $isLazy = true;

    protected function getStats(): array
    {
        $query = \App\Models\Cashflow::query();
        $query = $this->applyFiltersToQuery($query);

        $income = (clone $query)->where('type', 'income')->sum('amount');
        $expense = (clone $query)->where('type', 'expense')->sum('amount');
        $kasLaci = $income + $expense; // Seluruh kas masuk & keluar
        
        // Laba Bersih Murni (Tanpa campur tangan uang BEP / Suntikan Dana)
        $realIncome = (clone $query)->where('type', 'income')
            ->where(function($q) { $q->where('category', '!=', 'Tabungan BEP')->orWhereNull('category'); })
            ->sum('amount');
        $realExpense = (clone $query)->where('type', 'expense')
            ->where(function($q) { $q->where('category', '!=', 'Tabungan BEP')->orWhereNull('category'); })
            ->sum('amount');
        $labaBersih = $realIncome + $realExpense;

        $autoCollected = abs((clone $query)->where('reference_type', 'AUTO_BEP')->sum('amount'));
        $manualCollected = abs((clone $query)->where('category', 'Tabungan BEP')->where('type', 'expense')->where('reference_type', '!=', 'AUTO_BEP')->sum('amount'));
        $totalBep = $autoCollected + $manualCollected;
        
        $totalAset = $kasLaci + $totalBep;

        $formatValue = function ($amount) {
            $val = 'Rp ' . number_format($amount, 0, ',', '.');
            return new \Illuminate\Support\HtmlString('<span class="text-2xl xl:text-3xl tracking-tighter whitespace-nowrap">' . $val . '</span>');
        };

        return [
            Stat::make('Total Pendapatan', $formatValue($income))
                ->description('Seluruh kas masuk')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success')
                ->url(\App\Filament\Resources\CashflowResource::getUrl('index'))
                ->extraAttributes(['style' => 'background-color: rgba(16, 185, 129, 0.05);']),
            Stat::make('Total Pengeluaran', $formatValue($expense))
                ->description('Termasuk tabungan BEP')
                ->descriptionIcon('heroicon-m-arrow-trending-down')
                ->color('danger')
                ->url(\App\Filament\Resources\CashflowResource::getUrl('index'))
                ->extraAttributes(['style' => 'background-color: rgba(239, 68, 68, 0.05);']),
            Stat::make('Laba Bersih Murni', $formatValue($labaBersih))
                ->description('Dari operasional (tanpa hitung BEP)')
                ->color($labaBersih >= 0 ? 'success' : 'danger')
                ->extraAttributes(['style' => $labaBersih >= 0 ? 'background-color: rgba(16, 185, 129, 0.05);' : 'background-color: rgba(239, 68, 68, 0.05);']),
            Stat::make('Sisa Kas (Di Laci)', $formatValue($kasLaci))
                ->description('Uang operasional yang siap dipakai')
                ->color($kasLaci >= 0 ? 'warning' : 'danger')
                ->extraAttributes(['style' => 'background-color: rgba(245, 158, 11, 0.05);']),
            Stat::make('Tabungan BEP', $formatValue($totalBep))
                ->description('Tersimpan di kotak BEP')
                ->color('success')
                ->extraAttributes(['style' => 'background-color: rgba(16, 185, 129, 0.05);']),
            Stat::make('Total Aset Keseluruhan', $formatValue($totalAset))
                ->description('Laci Kasir + Tabungan BEP')
                ->color('primary')
                ->extraAttributes(['style' => 'background-color: rgba(59, 130, 246, 0.05);']),
        ];
    }
}
