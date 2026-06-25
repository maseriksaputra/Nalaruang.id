<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

use Carbon\Carbon;
use App\Filament\Traits\WithStatTracker;

class StatsOverview extends BaseWidget
{
    use \Filament\Widgets\Concerns\InteractsWithPageFilters;
    use \App\Filament\Traits\AppliesDashboardFilters;
    use WithStatTracker;

    protected static ?int $sort = 1;
    protected static bool $isLazy = true;
    protected static ?string $pollingInterval = null;

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

        // Calculate Today's Stats for Badge
        $todayQuery = clone $query;
        $todayQuery->whereDate('created_at', Carbon::today());
        
        $incomeToday = (clone $todayQuery)->where('type', 'income')->sum('amount');
        $expenseToday = (clone $todayQuery)->where('type', 'expense')->sum('amount');
        $kasLaciToday = $incomeToday + $expenseToday;
        
        $realIncomeToday = (clone $todayQuery)->where('type', 'income')
            ->where(function($q) { $q->where('category', '!=', 'Tabungan BEP')->orWhereNull('category'); })
            ->sum('amount');
        $realExpenseToday = (clone $todayQuery)->where('type', 'expense')
            ->where(function($q) { $q->where('category', '!=', 'Tabungan BEP')->orWhereNull('category'); })
            ->sum('amount');
        $labaBersihToday = $realIncomeToday + $realExpenseToday;

        $autoCollectedToday = abs((clone $todayQuery)->where('reference_type', 'AUTO_BEP')->sum('amount'));
        $manualCollectedToday = abs((clone $todayQuery)->where('category', 'Tabungan BEP')->where('type', 'expense')->where('reference_type', '!=', 'AUTO_BEP')->sum('amount'));
        $totalBepToday = $autoCollectedToday + $manualCollectedToday;
        
        $totalAsetToday = $kasLaciToday + $totalBepToday;

        $formatValue = function ($amount) {
            $formattedTarget = 'Rp ' . number_format($amount, 0, ',', '.');
            return new \Illuminate\Support\HtmlString("
                <span 
                    x-data=\"{ 
                        target: " . (float)$amount . ", 
                        current: 0,
                        formatted: 'Rp 0',
                        animate() {
                            let start = null;
                            const duration = 2000;
                            const t = this.target;
                            const c = this.current;
                            const step = (timestamp) => {
                                if (!start) start = timestamp;
                                let progress = Math.min((timestamp - start) / duration, 1);
                                let ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                                let val = c + (t - c) * ease;
                                this.current = val;
                                let v = Math.round(val);
                                this.formatted = (v < 0 ? '-' : '') + 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.abs(v));
                                if (progress < 1) {
                                    window.requestAnimationFrame(step);
                                } else {
                                    this.current = t;
                                    let f = Math.round(t);
                                    this.formatted = (f < 0 ? '-' : '') + 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.abs(f));
                                }
                            };
                            window.requestAnimationFrame(step);
                        }
                    }\"
                    x-init=\"
                        \$watch('target', () => animate()); 
                        animate();
                    \"
                    x-text=\"formatted\"
                    class=\"text-2xl xl:text-3xl font-bold tracking-tighter whitespace-nowrap\"
                >{$formattedTarget}</span>
            ");
        };

        $boldTitle = function ($title) {
            return new \Illuminate\Support\HtmlString('<span class="font-bold text-gray-800 dark:text-white">' . $title . '</span>');
        };

        return [
            $this->makeBackendTrackedStat($boldTitle('Total Pendapatan'), $formatValue($income), $incomeToday)
                ->description('Seluruh kas masuk')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success')
                ->url(\App\Filament\Resources\CashflowResource::getUrl('index'))
                ->extraAttributes(['style' => 'background-color: rgba(16, 185, 129, 0.05);']),
            $this->makeBackendTrackedStat($boldTitle('Total Pengeluaran'), $formatValue($expense), $expenseToday)
                ->description('Termasuk tabungan BEP')
                ->descriptionIcon('heroicon-m-arrow-trending-down')
                ->color('danger')
                ->url(\App\Filament\Resources\CashflowResource::getUrl('index'))
                ->extraAttributes(['style' => 'background-color: rgba(239, 68, 68, 0.05);']),
            $this->makeBackendTrackedStat($boldTitle('Laba Bersih Murni'), $formatValue($labaBersih), $labaBersihToday)
                ->description('Dari operasional (tanpa hitung BEP)')
                ->color($labaBersih >= 0 ? 'success' : 'danger')
                ->extraAttributes(['style' => $labaBersih >= 0 ? 'background-color: rgba(16, 185, 129, 0.05);' : 'background-color: rgba(239, 68, 68, 0.05);']),
            $this->makeBackendTrackedStat($boldTitle('Sisa Kas (Di Laci)'), $formatValue($kasLaci), $kasLaciToday)
                ->description('Uang operasional yang siap dipakai')
                ->color($kasLaci >= 0 ? 'warning' : 'danger')
                ->extraAttributes(['style' => 'background-color: rgba(245, 158, 11, 0.05);']),
            $this->makeBackendTrackedStat($boldTitle('Tabungan BEP'), $formatValue($totalBep), $totalBepToday)
                ->description('Tersimpan di kotak BEP')
                ->color('success')
                ->extraAttributes(['style' => 'background-color: rgba(16, 185, 129, 0.05);']),
            $this->makeBackendTrackedStat($boldTitle('Total Aset Keseluruhan'), $formatValue($totalAset), $totalAsetToday)
                ->description('Laci Kasir + Tabungan BEP')
                ->color('primary')
                ->extraAttributes(['style' => 'background-color: rgba(59, 130, 246, 0.05);']),
        ];
    }
}
