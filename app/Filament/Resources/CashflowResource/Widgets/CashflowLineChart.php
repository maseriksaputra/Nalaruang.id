<?php

namespace App\Filament\Resources\CashflowResource\Widgets;

use Filament\Widgets\ChartWidget;
use Filament\Tables\Contracts\HasTable;
use Livewire\Attributes\Reactive;
use App\Filament\Resources\CashflowResource\Pages\ListCashflows;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CashflowLineChart extends ChartWidget
{
    protected static ?string $heading = 'Tren Arus Kas';
    protected int | string | array $columnSpan = 'full';
    protected static ?string $maxHeight = '300px';

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

    protected function getData(): array
    {
        $query = $this->getPageTableQuery();
        
        // Bersihkan order by bawaan dari table sebelum di-group by
        $query->reorder();
        
        // Dapatkan data terfilter dan kelompokkan per tanggal
        $data = (clone $query)
            ->select(
                DB::raw('DATE(transaction_date) as date'),
                DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as total_income'),
                DB::raw('SUM(CASE WHEN type = "expense" THEN ABS(amount) ELSE 0 END) as total_expense'),
                DB::raw('SUM(CASE WHEN type = "income" AND category = "F&B" THEN amount ELSE 0 END) as fnb_income'),
                DB::raw('SUM(CASE WHEN type = "income" AND category = "ATK" THEN amount ELSE 0 END) as atk_income'),
                DB::raw('SUM(CASE WHEN type = "income" AND category = "Printing" THEN amount ELSE 0 END) as print_income'),
                DB::raw('SUM(CASE WHEN type = "income" AND category = "Digital" THEN amount ELSE 0 END) as digital_income')
            )
            ->groupBy(DB::raw('DATE(transaction_date)'))
            ->orderBy(DB::raw('DATE(transaction_date)'))
            ->get();

        $labels = [];
        $totalIncome = [];
        $totalExpense = [];
        $fnbIncome = [];
        $atkIncome = [];
        $printIncome = [];
        $digitalIncome = [];

        foreach ($data as $row) {
            $labels[] = Carbon::parse($row->date)->format('d M');
            $totalIncome[] = $row->total_income;
            $totalExpense[] = $row->total_expense;
            $fnbIncome[] = $row->fnb_income;
            $atkIncome[] = $row->atk_income;
            $printIncome[] = $row->print_income;
            $digitalIncome[] = $row->digital_income;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Pemasukan',
                    'data' => $totalIncome,
                    'borderColor' => '#16a34a', // green
                    'backgroundColor' => 'rgba(22, 163, 74, 0.1)',
                ],
                [
                    'label' => 'Pengeluaran',
                    'data' => $totalExpense,
                    'borderColor' => '#dc2626', // red
                    'backgroundColor' => 'rgba(220, 38, 38, 0.1)',
                ],
                [
                    'label' => 'F&B',
                    'data' => $fnbIncome,
                    'borderColor' => '#f59e0b', // amber
                    'backgroundColor' => 'rgba(245, 158, 11, 0.1)',
                    'hidden' => true, // default sembunyikan supaya tidak penuh
                ],
                [
                    'label' => 'ATK',
                    'data' => $atkIncome,
                    'borderColor' => '#0ea5e9', // sky blue
                    'backgroundColor' => 'rgba(14, 165, 233, 0.1)',
                    'hidden' => true,
                ],
                [
                    'label' => 'Printing',
                    'data' => $printIncome,
                    'borderColor' => '#10b981', // emerald
                    'backgroundColor' => 'rgba(16, 185, 129, 0.1)',
                    'hidden' => true,
                ],
                [
                    'label' => 'Digital',
                    'data' => $digitalIncome,
                    'borderColor' => '#6366f1', // indigo
                    'backgroundColor' => 'rgba(99, 102, 241, 0.1)',
                    'hidden' => true,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
