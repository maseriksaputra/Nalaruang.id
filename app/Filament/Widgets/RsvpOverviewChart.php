<?php

namespace App\Filament\Widgets;

use App\Models\Rsvp;
use Filament\Widgets\ChartWidget;

class RsvpOverviewChart extends ChartWidget
{
    protected static bool $isLazy = true;

    protected static ?string $heading = 'Rasio Kehadiran Tamu (RSVP)';
    protected static ?int $sort = 9;
    protected int | string | array $columnSpan = 1;
    protected static ?string $maxHeight = '275px';

    protected function getData(): array
    {
        $hadir = Rsvp::where('status', 'Hadir')->count();
        $tidakHadir = Rsvp::where('status', '!=', 'Hadir')->count();

        return [
            'datasets' => [
                [
                    'label' => 'Total',
                    'data' => [$hadir, $tidakHadir],
                    'backgroundColor' => [
                        'rgba(16, 185, 129, 0.8)', // Emerald
                        'rgba(239, 68, 68, 0.8)',  // Red
                    ],
                    'hoverOffset' => 4,
                ],
            ],
            'labels' => ['Hadir', 'Tidak Hadir'],
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
