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
        $data = Cashflow::with('service')
            ->select('service_id', DB::raw('SUM(amount) as total_income'))
            ->where('type', 'income')
            ->groupBy('service_id')
            ->get();

        $labels = [];
        $values = [];
        $colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

        foreach ($data as $index => $row) {
            $labels[] = $row->service ? $row->service->title : 'Tanpa Bidang Usaha';
            $values[] = $row->total_income;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Total Pendapatan',
                    'data' => $values,
                    'backgroundColor' => array_slice($colors, 0, count($values)),
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
