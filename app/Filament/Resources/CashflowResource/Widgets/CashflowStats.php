<?php

namespace App\Filament\Resources\CashflowResource\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Filament\Resources\CashflowResource\Widgets\Concerns\HasCashflowQuery;
use App\Filament\Traits\WithStatTracker;

class CashflowStats extends BaseWidget
{
    use HasCashflowQuery;
    use WithStatTracker;

    protected static ?string $pollingInterval = null;

    protected function getPageTableQuery()
    {
        return $this->getBaseCashflowQuery();
    }

    protected function getColumns(): int
    {
        return 3;
    }

    protected function getStats(): array
    {
        // $this->getPageTableQuery() returns the query builder instance with all active table filters applied!
        $query = $this->getPageTableQuery();
        
        // Optimize 7 queries into 1 raw aggregation query for performance
        $stats = (clone $query)
            ->selectRaw("
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
                SUM(CASE WHEN type = 'income' AND category = 'F&B' THEN amount ELSE 0 END) as income_fnb,
                SUM(CASE WHEN type = 'income' AND category = 'ATK' THEN amount ELSE 0 END) as income_atk,
                SUM(CASE WHEN type = 'income' AND category = 'Printing' THEN amount ELSE 0 END) as income_print,
                SUM(CASE WHEN type = 'income' AND category = 'Digital' THEN amount ELSE 0 END) as income_digital,
                SUM(CASE WHEN type = 'income' AND category = 'Souvenir' THEN amount ELSE 0 END) as income_souvenir,
                COUNT(*) as total_count
            ")->first();

        $totalIncome = $stats->total_income ?? 0;
        $totalExpense = $stats->total_expense ?? 0;
        $totalNet = $totalIncome + $totalExpense; // Add them because expense is already negative

        $incomeFnB = $stats->income_fnb ?? 0;
        $incomeAtk = $stats->income_atk ?? 0;
        $incomePrint = $stats->income_print ?? 0;
        $incomeDigital = $stats->income_digital ?? 0;
        $incomeSouvenir = $stats->income_souvenir ?? 0;
        $totalCount = $stats->total_count ?? 0;
        
        // Calculate Today's Stats for Badge
        $todayQuery = clone $query;
        $todayStats = $todayQuery->whereDate('created_at', \Carbon\Carbon::today())
            ->selectRaw("
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
                SUM(CASE WHEN type = 'income' AND category = 'F&B' THEN amount ELSE 0 END) as income_fnb,
                SUM(CASE WHEN type = 'income' AND category = 'ATK' THEN amount ELSE 0 END) as income_atk,
                SUM(CASE WHEN type = 'income' AND category = 'Printing' THEN amount ELSE 0 END) as income_print,
                SUM(CASE WHEN type = 'income' AND category = 'Digital' THEN amount ELSE 0 END) as income_digital,
                SUM(CASE WHEN type = 'income' AND category = 'Souvenir' THEN amount ELSE 0 END) as income_souvenir,
                COUNT(*) as total_count
            ")->first();

        $todayTotalIncome = $todayStats->total_income ?? 0;
        $todayTotalExpense = $todayStats->total_expense ?? 0;
        $todayTotalNet = $todayTotalIncome + $todayTotalExpense;
        $todayFnB = $todayStats->income_fnb ?? 0;
        $todayAtk = $todayStats->income_atk ?? 0;
        $todayPrint = $todayStats->income_print ?? 0;
        $todayDigital = $todayStats->income_digital ?? 0;
        $todaySouvenir = $todayStats->income_souvenir ?? 0;
        $todayCount = $todayStats->total_count ?? 0;
        $totalExpense = $stats->total_expense ?? 0;
        $totalNet = $totalIncome + $totalExpense; // Add them because expense is already negative

        $incomeFnB = $stats->income_fnb ?? 0;
        $incomeAtk = $stats->income_atk ?? 0;
        $incomePrint = $stats->income_print ?? 0;
        $incomeDigital = $stats->income_digital ?? 0;
        $incomeSouvenir = $stats->income_souvenir ?? 0;
        $totalCount = $stats->total_count ?? 0;

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

        $formatString = function ($amount, $suffix = '') {
            $formattedTarget = number_format($amount, 0, ',', '.') . ' ' . $suffix;
            return new \Illuminate\Support\HtmlString("
                <span 
                    x-data=\"{ 
                        target: " . (float)$amount . ", 
                        current: 0,
                        formatted: '0 {$suffix}',
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
                                this.formatted = Math.round(val) + ' {$suffix}';
                                if (progress < 1) {
                                    window.requestAnimationFrame(step);
                                } else {
                                    this.current = t;
                                    this.formatted = Math.round(t) + ' {$suffix}';
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
            $this->makeBackendTrackedStat($boldTitle('Total Pemasukan'), $formatValue($totalIncome), $todayTotalIncome)
                ->description('Dari data yang sedang disaring')
                ->descriptionIcon('heroicon-m-arrow-trending-up', \Filament\Support\Enums\IconPosition::Before)
                ->color('success')
                ->extraAttributes(['style' => 'background-color: #f0fdf4; border: 1px solid #bbf7d0;']),

            $this->makeBackendTrackedStat($boldTitle('Total Pengeluaran'), $formatValue(abs($totalExpense)), abs($todayTotalExpense))
                ->description('Dari data yang sedang disaring')
                ->descriptionIcon('heroicon-m-arrow-trending-down', \Filament\Support\Enums\IconPosition::Before)
                ->color('danger')
                ->extraAttributes(['style' => 'background-color: #fef2f2; border: 1px solid #fecaca;']),
                
            $this->makeBackendTrackedStat($boldTitle('Laba Bersih (Nett)'), $formatValue($totalNet), $todayTotalNet)
                ->description('Pemasukan - Pengeluaran')
                ->descriptionIcon($totalNet >= 0 ? 'heroicon-m-arrow-up-circle' : 'heroicon-m-exclamation-triangle', \Filament\Support\Enums\IconPosition::Before)
                ->color($totalNet >= 0 ? 'success' : 'danger')
                ->extraAttributes(['style' => 'background-color: #eff6ff; border: 1px solid #bfdbfe;']),

            $this->makeBackendTrackedStat($boldTitle('Omzet F&B'), $formatValue($incomeFnB), $todayFnB)
                ->description('Pemasukan kategori F&B')
                ->descriptionIcon('heroicon-m-cake', \Filament\Support\Enums\IconPosition::Before)
                ->color('warning')
                ->extraAttributes(['style' => 'background-color: #fffbeb; border: 1px solid #fde68a;']),

            $this->makeBackendTrackedStat($boldTitle('Omzet ATK'), $formatValue($incomeAtk), $todayAtk)
                ->description('Pemasukan kategori ATK')
                ->descriptionIcon('heroicon-m-pencil-square', \Filament\Support\Enums\IconPosition::Before)
                ->color('info')
                ->extraAttributes(['style' => 'background-color: #f0f9ff; border: 1px solid #bae6fd;']),

            $this->makeBackendTrackedStat($boldTitle('Omzet Printing'), $formatValue($incomePrint), $todayPrint)
                ->description('Pemasukan kategori Printing')
                ->descriptionIcon('heroicon-m-printer', \Filament\Support\Enums\IconPosition::Before)
                ->color('success')
                ->extraAttributes(['style' => 'background-color: #ecfdf5; border: 1px solid #a7f3d0;']),

            $this->makeBackendTrackedStat($boldTitle('Omzet Digital'), $formatValue($incomeDigital), $todayDigital)
                ->description('Pemasukan kategori Digital')
                ->descriptionIcon('heroicon-m-device-phone-mobile', \Filament\Support\Enums\IconPosition::Before)
                ->color('primary')
                ->extraAttributes(['style' => 'background-color: #eef2ff; border: 1px solid #c7d2fe;']),

            $this->makeBackendTrackedStat($boldTitle('Omzet Souvenir'), $formatValue($incomeSouvenir), $todaySouvenir)
                ->description('Pemasukan kategori Souvenir')
                ->descriptionIcon('heroicon-m-gift', \Filament\Support\Enums\IconPosition::Before)
                ->color('danger')
                ->extraAttributes(['style' => 'background-color: #fff1f2; border: 1px solid #fecdd3;']),

            $this->makeBackendTrackedStat($boldTitle('Jumlah Transaksi'), $formatString($totalCount, 'Transaksi'), $todayCount)
                ->description('Total aktivitas tercatat')
                ->descriptionIcon('heroicon-m-document-text', \Filament\Support\Enums\IconPosition::Before)
                ->color('gray')
                ->extraAttributes(['style' => 'background-color: #f8fafc; border: 1px solid #e2e8f0;']),
        ];
    }
}
