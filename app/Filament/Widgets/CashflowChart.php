<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Cashflow;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CashflowChart extends ChartWidget
{
    protected static bool $isLazy = true;

    protected static ?string $heading = 'Arus Kas (Uang Masuk vs Uang Keluar)';
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 1;
    protected static ?string $maxHeight = '275px';

    protected function getData(): array
    {
        $startDate = Carbon::now()->subDays(30);

        $incomeData = Cashflow::select(
            DB::raw('DATE(transaction_date) as date'),
            DB::raw('SUM(amount) as total')
        )
        ->where('type', 'income')
        ->where('transaction_date', '>=', $startDate)
        ->groupBy('date')
        ->orderBy('date')
        ->get()
        ->keyBy('date');

        $expenseData = Cashflow::select(
            DB::raw('DATE(transaction_date) as date'),
            DB::raw('SUM(amount) as total')
        )
        ->where('type', 'expense')
        ->where('transaction_date', '>=', $startDate)
        ->groupBy('date')
        ->orderBy('date')
        ->get()
        ->keyBy('date');

        // We need a unified array of dates
        $dates = $incomeData->keys()->merge($expenseData->keys())->unique()->sort()->values();

        $incomeArray = [];
        $expenseArray = [];

        foreach ($dates as $date) {
            $incomeArray[] = $incomeData->has($date) ? $incomeData[$date]->total : 0;
            $expenseArray[] = $expenseData->has($date) ? $expenseData[$date]->total : 0;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Uang Masuk',
                    'data' => $incomeArray,
                    'borderColor' => '#10b981', // green
                    'backgroundColor' => 'rgba(16, 185, 129, 0.2)',
                    'fill' => true,
                    'tension' => 0.4,
                ],
                [
                    'label' => 'Uang Keluar',
                    'data' => $expenseArray,
                    'borderColor' => '#ef4444', // red
                    'backgroundColor' => 'rgba(239, 68, 68, 0.2)',
                    'fill' => true,
                    'tension' => 0.4,
                ],
            ],
            'labels' => $dates->map(fn($d) => Carbon::parse($d)->format('d M'))->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getOptions(): array
    {
        return [
            'animation' => false,
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                ],
            ],
        ];
    }
}
