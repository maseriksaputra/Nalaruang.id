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
        
        $totalIncome = (clone $query)->where('type', 'income')->sum('amount');
        $totalExpense = (clone $query)->where('type', 'expense')->sum('amount');
        $totalNet = $totalIncome + $totalExpense; // Add them because expense is already negative

        $incomeFnB = (clone $query)->where('type', 'income')->where('category', 'F&B')->sum('amount');
        $incomeAtk = (clone $query)->where('type', 'income')->where('category', 'ATK')->sum('amount');
        $incomePrint = (clone $query)->where('type', 'income')->where('category', 'Printing')->sum('amount');
        $incomeDigital = (clone $query)->where('type', 'income')->where('category', 'Digital')->sum('amount');

        $formatValue = function ($amount) {
            return new \Illuminate\Support\HtmlString("
                <span 
                    x-data=\"{ target: " . (float)$amount . " }\"
                    x-init=\"(() => {
                        let start = null;
                        const duration = 2000;
                        const t = target;
                        const el = \$el;
                        const format = (val) => {
                            let v = Math.round(val);
                            return (v < 0 ? '-' : '') + 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.abs(v));
                        };
                        const step = (timestamp) => {
                            if (!start) start = timestamp;
                            let progress = Math.min((timestamp - start) / duration, 1);
                            let ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                            el.innerText = format(t * ease);
                            if (progress < 1) {
                                window.requestAnimationFrame(step);
                            } else {
                                el.innerText = format(t);
                            }
                        };
                        window.requestAnimationFrame(step);
                    })()\"
                    class=\"text-2xl xl:text-3xl font-bold tracking-tighter whitespace-nowrap\"
                >Rp 0</span>
            ");
        };

        $formatString = function ($amount, $suffix = '') {
            return new \Illuminate\Support\HtmlString("
                <span 
                    x-data=\"{ target: " . (float)$amount . " }\"
                    x-init=\"(() => {
                        let start = null;
                        const duration = 2000;
                        const t = target;
                        const el = \$el;
                        const step = (timestamp) => {
                            if (!start) start = timestamp;
                            let progress = Math.min((timestamp - start) / duration, 1);
                            let ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                            el.innerText = Math.round(t * ease) + ' {$suffix}';
                            if (progress < 1) {
                                window.requestAnimationFrame(step);
                            } else {
                                el.innerText = Math.round(t) + ' {$suffix}';
                            }
                        };
                        window.requestAnimationFrame(step);
                    })()\"
                    class=\"text-2xl xl:text-3xl font-bold tracking-tighter whitespace-nowrap\"
                >0 {$suffix}</span>
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

            Stat::make($boldTitle('Jumlah Transaksi'), $formatString((clone $query)->count(), 'Transaksi'))
                ->description('Total aktivitas tercatat')
                ->descriptionIcon('heroicon-m-document-text', \Filament\Support\Enums\IconPosition::Before)
                ->color('gray'),
        ];
    }
}
