<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Template;
use Illuminate\Support\Facades\DB;

class TopProductsChart extends ChartWidget
{
    protected static bool $isLazy = true;

    protected static ?string $heading = 'Peringkat Layanan / Produk Terlaris';
    protected static ?int $sort = 6;
    protected int | string | array $columnSpan = 1;
    protected static ?string $maxHeight = '275px';

    protected function getData(): array
    {
        // Get top 5 templates by number of orders
        $topTemplates = Template::withCount('orders')
            ->orderByDesc('orders_count')
            ->limit(5)
            ->get();

        $labels = [];
        $data = [];

        foreach ($topTemplates as $template) {
            $labels[] = strlen($template->name) > 20 ? substr($template->name, 0, 17) . '...' : $template->name;
            $data[] = $template->orders_count;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Total Terjual (Pesanan)',
                    'data' => $data,
                    'backgroundColor' => '#f59e0b', // amber
                    'borderColor' => '#d97706',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'animation' => [
                'duration' => 2000,
                'easing' => 'easeOutBounce',
            ],
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                ],
            ],
        ];
    }
}
