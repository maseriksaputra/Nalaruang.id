<?php

namespace App\Filament\Resources\CashflowResource\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Filament\Tables\Contracts\HasTable;
use Livewire\Attributes\Reactive;
use App\Filament\Resources\CashflowResource\Pages\ListCashflows;

class CashflowStats extends BaseWidget
{
    #[Reactive]
    public ?array $paginators = [];

    #[Reactive]
    public ?array $tableColumnSearches = [];

    #[Reactive]
    public ?string $tableGrouping = null;

    #[Reactive]
    public ?string $tableGroupingDirection = null;

    #[Reactive]
    public ?array $tableFilters = null;

    #[Reactive]
    public int | string | null $tableRecordsPerPage = null;

    #[Reactive]
    public ?string $tableSearch = '';

    #[Reactive]
    public ?string $tableSortColumn = null;

    #[Reactive]
    public ?string $tableSortDirection = null;

    #[Reactive]
    public ?string $activeTab = null;

    #[Reactive]
    public ?array $customFilters = null;

    protected HasTable $tablePage;

    protected function getTablePage(): string
    {
        return ListCashflows::class;
    }

    protected function getTablePageInstance(): HasTable
    {
        if (isset($this->tablePage)) {
            return $this->tablePage;
        }

        /** @var HasTable $tableComponent */
        $page = app('livewire')->new($this->getTablePage());
        \Livewire\trigger('mount', $page, [], null, null);

        $page->activeTab = $this->activeTab;
        $page->paginators = $this->paginators ?? [];
        $page->tableColumnSearches = $this->tableColumnSearches ?? [];
        $page->tableFilters = $this->tableFilters;
        $page->tableGrouping = $this->tableGrouping;
        $page->tableGroupingDirection = $this->tableGroupingDirection;
        $page->tableRecordsPerPage = $this->tableRecordsPerPage;
        $page->tableSearch = $this->tableSearch;
        $page->tableSortColumn = $this->tableSortColumn;
        $page->tableSortDirection = $this->tableSortDirection;
        $page->customFilters = $this->customFilters;

        return $this->tablePage = $page;
    }

    protected function getPageTableQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return $this->getTablePageInstance()->getFilteredSortedTableQuery();
    }

    protected function getColumns(): int
    {
        return 4;
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
                COUNT(*) as total_count
            ")->first();

        $totalIncome = $stats->total_income ?? 0;
        $totalExpense = $stats->total_expense ?? 0;
        $totalNet = $totalIncome + $totalExpense; // Add them because expense is already negative

        $incomeFnB = $stats->income_fnb ?? 0;
        $incomeAtk = $stats->income_atk ?? 0;
        $incomePrint = $stats->income_print ?? 0;
        $incomeDigital = $stats->income_digital ?? 0;
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
            Stat::make($boldTitle('Total Pemasukan'), $formatValue($totalIncome))
                ->description('Dari data yang sedang disaring')
                ->descriptionIcon('heroicon-m-arrow-trending-up', \Filament\Support\Enums\IconPosition::Before)
                ->color('success'),

            Stat::make($boldTitle('Total Pengeluaran'), $formatValue(abs($totalExpense)))
                ->description('Dari data yang sedang disaring')
                ->descriptionIcon('heroicon-m-arrow-trending-down', \Filament\Support\Enums\IconPosition::Before)
                ->color('danger'),
                
            Stat::make($boldTitle('Laba Bersih (Nett)'), $formatValue($totalNet))
                ->description('Pemasukan - Pengeluaran')
                ->descriptionIcon($totalNet >= 0 ? 'heroicon-m-arrow-up-circle' : 'heroicon-m-exclamation-triangle', \Filament\Support\Enums\IconPosition::Before)
                ->color($totalNet >= 0 ? 'success' : 'danger'),

            Stat::make($boldTitle('Omzet F&B'), $formatValue($incomeFnB))
                ->description('Pemasukan kategori F&B')
                ->descriptionIcon('heroicon-m-cake', \Filament\Support\Enums\IconPosition::Before)
                ->color('warning'),

            Stat::make($boldTitle('Omzet ATK'), $formatValue($incomeAtk))
                ->description('Pemasukan kategori ATK')
                ->descriptionIcon('heroicon-m-pencil-square', \Filament\Support\Enums\IconPosition::Before)
                ->color('info'),

            Stat::make($boldTitle('Omzet Printing'), $formatValue($incomePrint))
                ->description('Pemasukan kategori Printing')
                ->descriptionIcon('heroicon-m-printer', \Filament\Support\Enums\IconPosition::Before)
                ->color('success'),

            Stat::make($boldTitle('Omzet Digital'), $formatValue($incomeDigital))
                ->description('Pemasukan kategori Digital')
                ->descriptionIcon('heroicon-m-device-phone-mobile', \Filament\Support\Enums\IconPosition::Before)
                ->color('primary'),

            Stat::make($boldTitle('Jumlah Transaksi'), $formatString($totalCount, 'Transaksi'))
                ->description('Total aktivitas tercatat')
                ->descriptionIcon('heroicon-m-document-text', \Filament\Support\Enums\IconPosition::Before)
                ->color('gray'),
        ];
    }
}
