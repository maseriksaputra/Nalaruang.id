<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Cashflow;
use Illuminate\Support\Facades\DB;

class ServiceRevenuePieChart extends ChartWidget
{
    protected static bool $isLazy = true;

    protected static ?string $heading = 'Proporsi Pendapatan per Bidang Usaha';
    protected static ?int $sort = 5;
    protected int | string | array $columnSpan = 1;
    protected static ?string $maxHeight = '275px';

    protected function getData(): array
    {
        $data = Cashflow::select('category', DB::raw('SUM(amount) as total_income'))
            ->where('type', 'income')
            ->groupBy('category')
            ->get();

        $labels = [];
        $values = [];
        
        // Sesuaikan dengan warna badge di CashflowResource
        $colorsMap = [
            'F&B' => '#f59e0b',       // warning
            'ATK' => '#0ea5e9',       // info
            'Printing' => '#10b981',  // success
            'Digital' => '#6366f1',   // primary
            'Tabungan BEP' => '#8b5cf6', // indigo
        ];
        
        $colors = [];

        foreach ($data as $index => $row) {
            $cat = $row->category ?: 'Tanpa Kategori';
            $labels[] = $cat;
            $values[] = $row->total_income;
            $colors[] = $colorsMap[$row->category] ?? '#9ca3af'; // default gray untuk yang tidak cocok
        }

        return [
            'datasets' => [
                [
                    'label' => 'Total Pendapatan',
                    'data' => $values,
                    'backgroundColor' => $colors,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'pie';
    }

    protected function getOptions(): array
    {
        return [
            'animation' => [
                'animateScale' => true,
                'animateRotate' => true,
                'duration' => 2000,
                'easing' => 'easeOutCirc',
            ],
        ];
    }
}
