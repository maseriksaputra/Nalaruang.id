<?php

namespace App\Filament\Widgets;

use App\Models\InvitationVisitor;
use Filament\Widgets\ChartWidget;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class VisitorTrendChart extends ChartWidget
{
    use \Filament\Widgets\Concerns\InteractsWithPageFilters;
    use \App\Filament\Traits\AppliesDashboardFilters;

    protected static bool $isLazy = true;

    protected static ?string $heading = 'Statistik Kunjungan Server';
    protected static ?int $sort = 8;
    protected int | string | array $columnSpan = 1;
    protected static ?string $maxHeight = '275px';

    protected function getData(): array
    {
        $query = InvitationVisitor::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as aggregate')
            )
            ->groupBy('date')
            ->orderBy('date');

        $query = $this->applyFiltersToQuery($query, 'created_at');
        $visits = $query->get();

        $labels = $visits->pluck('date')->map(fn($d) => Carbon::parse($d)->format('d M'))->toArray();
        $data = $visits->pluck('aggregate')->toArray();

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
