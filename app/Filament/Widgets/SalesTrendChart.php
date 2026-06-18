<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Cashflow;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SalesTrendChart extends ChartWidget
{
    use \Filament\Widgets\Concerns\InteractsWithPageFilters;
    use \App\Filament\Traits\AppliesDashboardFilters;

    protected static bool $isLazy = true;

    protected static ?string $heading = 'Tren Penjualan (Pesanan Masuk)';
    protected static ?int $sort = 3;
    protected int | string | array $columnSpan = 1;
    protected static ?string $maxHeight = '275px';

    protected function getData(): array
    {
        $query = Cashflow::select(
            DB::raw('DATE(transaction_date) as date'),
            DB::raw('COUNT(*) as count')
        )
        ->where('reference_type', 'App\Models\Order')
        ->groupBy('date')
        ->orderBy('date');

        $query = $this->applyFiltersToQuery($query);
        $data = $query->get();

        return [
            'datasets' => [
                [
                    'label' => 'Pesanan Baru',
                    'data' => $data->pluck('count')->toArray(),
                    'borderColor' => '#3b82f6',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.2)',
                    'fill' => true,
                    'tension' => 0.4,
                ],
            ],
            'labels' => $data->pluck('date')->map(fn($d) => Carbon::parse($d)->format('d M'))->toArray(),
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
