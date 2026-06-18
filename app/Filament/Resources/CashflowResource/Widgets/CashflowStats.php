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

        return [
            Stat::make('Total Pemasukan', 'Rp ' . number_format($totalIncome, 0, ',', '.'))
                ->description('Dari data yang sedang disaring')
                ->descriptionIcon('heroicon-m-arrow-trending-up', \Filament\Support\Enums\IconPosition::Before)
                ->color('success'),

            Stat::make('Total Pengeluaran', 'Rp ' . number_format(abs($totalExpense), 0, ',', '.'))
                ->description('Dari data yang sedang disaring')
                ->descriptionIcon('heroicon-m-arrow-trending-down', \Filament\Support\Enums\IconPosition::Before)
                ->color('danger'),
                
            Stat::make('Laba Bersih (Nett)', 'Rp ' . number_format($totalNet, 0, ',', '.'))
                ->description('Pemasukan - Pengeluaran')
                ->descriptionIcon($totalNet >= 0 ? 'heroicon-m-arrow-up-circle' : 'heroicon-m-exclamation-triangle', \Filament\Support\Enums\IconPosition::Before)
                ->color($totalNet >= 0 ? 'success' : 'danger'),

            Stat::make('Omzet F&B', 'Rp ' . number_format($incomeFnB, 0, ',', '.'))
                ->description('Pemasukan kategori F&B')
                ->descriptionIcon('heroicon-m-cake', \Filament\Support\Enums\IconPosition::Before)
                ->color('warning'),

            Stat::make('Omzet ATK', 'Rp ' . number_format($incomeAtk, 0, ',', '.'))
                ->description('Pemasukan kategori ATK')
                ->descriptionIcon('heroicon-m-pencil-square', \Filament\Support\Enums\IconPosition::Before)
                ->color('info'),

            Stat::make('Omzet Printing', 'Rp ' . number_format($incomePrint, 0, ',', '.'))
                ->description('Pemasukan kategori Printing')
                ->descriptionIcon('heroicon-m-printer', \Filament\Support\Enums\IconPosition::Before)
                ->color('success'),

            Stat::make('Omzet Digital', 'Rp ' . number_format($incomeDigital, 0, ',', '.'))
                ->description('Pemasukan kategori Digital')
                ->descriptionIcon('heroicon-m-device-phone-mobile', \Filament\Support\Enums\IconPosition::Before)
                ->color('primary'),

            Stat::make('Jumlah Transaksi', (clone $query)->count() . ' Transaksi')
                ->description('Total aktivitas tercatat')
                ->descriptionIcon('heroicon-m-document-text', \Filament\Support\Enums\IconPosition::Before)
                ->color('gray'),
        ];
    }
}
