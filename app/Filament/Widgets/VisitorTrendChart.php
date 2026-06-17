<?php

namespace App\Filament\Widgets;

use App\Models\InvitationVisitor;
use Filament\Widgets\ChartWidget;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class VisitorTrendChart extends ChartWidget
{
    protected static bool $isLazy = true;

    protected static ?string $heading = 'Statistik Kunjungan Server (30 Hari Terakhir)';
    protected static ?int $sort = 8;
    protected int | string | array $columnSpan = 1;
    protected static ?string $maxHeight = '275px';

    protected function getData(): array
    {
        $startDate = Carbon::now()->subDays(29)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $visits = InvitationVisitor::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as aggregate')
            )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $labels = [];
        $data = [];

        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $labels[] = Carbon::parse($date)->format('d M');
            $data[] = $visits->has($date) ? $visits[$date]->aggregate : 0;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Total Kunjungan',
                    'data' => $data,
                    'borderColor' => '#10b981',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.2)',
                    'fill' => true,
                    'tension' => 0.4, // Smooth curve
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
