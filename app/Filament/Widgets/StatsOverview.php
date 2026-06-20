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
            return new \Illuminate\Support\HtmlString("
                <span 
                    x-data=\"{ count: 0, target: " . (float)$amount . " }\"
                    x-init=\"
                        let duration = 2000;
                        let start = null;
                        let step = (timestamp) => {
                            if (!start) start = timestamp;
                            let progress = Math.min((timestamp - start) / duration, 1);
                            let ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                            count = target * ease;
                            let val = Math.round(count);
                            let formatted = (val < 0 ? '-' : '') + 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.abs(val));
                            \$el.innerText = formatted;
                            if (progress < 1) {
                                window.requestAnimationFrame(step);
                            } else {
                                let finalVal = Math.round(target);
                                \$el.innerText = (finalVal < 0 ? '-' : '') + 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.abs(finalVal));
                            }
                        };
                        window.requestAnimationFrame(step);
                    \"
                    class=\"text-2xl xl:text-3xl font-bold tracking-tighter whitespace-nowrap\"
                >Rp 0</span>
            ");
        };

        $boldTitle = function ($title) {
            return new \Illuminate\Support\HtmlString('<span class="font-bold text-gray-800 dark:text-white">' . $title . '</span>');
        };

        return [
            Stat::make($boldTitle('Total Pendapatan'), $formatValue($income))
                ->description('Seluruh kas masuk')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success')
                ->url(\App\Filament\Resources\CashflowResource::getUrl('index'))
                ->extraAttributes(['style' => 'background-color: rgba(16, 185, 129, 0.05);']),
            Stat::make($boldTitle('Total Pengeluaran'), $formatValue($expense))
                ->description('Termasuk tabungan BEP')
                ->descriptionIcon('heroicon-m-arrow-trending-down')
                ->color('danger')
                ->url(\App\Filament\Resources\CashflowResource::getUrl('index'))
                ->extraAttributes(['style' => 'background-color: rgba(239, 68, 68, 0.05);']),
            Stat::make($boldTitle('Laba Bersih Murni'), $formatValue($labaBersih))
                ->description('Dari operasional (tanpa hitung BEP)')
                ->color($labaBersih >= 0 ? 'success' : 'danger')
                ->extraAttributes(['style' => $labaBersih >= 0 ? 'background-color: rgba(16, 185, 129, 0.05);' : 'background-color: rgba(239, 68, 68, 0.05);']),
            Stat::make($boldTitle('Sisa Kas (Di Laci)'), $formatValue($kasLaci))
                ->description('Uang operasional yang siap dipakai')
                ->color($kasLaci >= 0 ? 'warning' : 'danger')
                ->extraAttributes(['style' => 'background-color: rgba(245, 158, 11, 0.05);']),
            Stat::make($boldTitle('Tabungan BEP'), $formatValue($totalBep))
                ->description('Tersimpan di kotak BEP')
                ->color('success')
                ->extraAttributes(['style' => 'background-color: rgba(16, 185, 129, 0.05);']),
            Stat::make($boldTitle('Total Aset Keseluruhan'), $formatValue($totalAset))
                ->description('Laci Kasir + Tabungan BEP')
                ->color('primary')
                ->extraAttributes(['style' => 'background-color: rgba(59, 130, 246, 0.05);']),
        ];
    }
}
