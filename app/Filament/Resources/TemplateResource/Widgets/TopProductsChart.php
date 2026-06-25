<?php

namespace App\Filament\Resources\TemplateResource\Widgets;

use Filament\Widgets\ChartWidget;
use Livewire\Attributes\Reactive;
use App\Models\Template;
use Illuminate\Support\Facades\DB;

class TopProductsChart extends ChartWidget
{
    protected static ?string $heading = 'Top 5 Produk Paling Ramai';

    protected static ?string $maxHeight = '300px';

    protected int | string | array $columnSpan = 'full';

    #[Reactive]
    public ?string $activeTab = null;

    protected function getData(): array
    {
        $query = Template::query();
        
        if ($this->activeTab === 'cetak_fisik') {
            $query->whereHas('service', fn ($q) => $q->whereIn('slug', ['cetak-fisik', 'cetak-fisik-premium']));
        } elseif ($this->activeTab === 'event_digital') {
            $query->whereHas('service', fn ($q) => $q->where('slug', 'event-digital'));
        } elseif ($this->activeTab === 'souvenir') {
            $query->whereHas('service', fn ($q) => $q->where('slug', 'souvenir-merchandise'));
        } elseif ($this->activeTab === 'web_app') {
            $query->whereHas('service', fn ($q) => $q->where('slug', 'web-mobile-app'));
        }

        $topProducts = $query->where('is_active', true)
            ->select('name', DB::raw('(COALESCE(demo_views, 0) + COALESCE(total_invitation_views, 0)) as total_views'))
            ->orderByDesc('total_views')
            ->limit(5)
            ->get();

        $labels = $topProducts->pluck('name')->toArray();
        $data = $topProducts->pluck('total_views')->toArray();

        $colors = [
            '#e11d48', // Rose
            '#2563eb', // Blue
            '#059669', // Emerald
            '#d97706', // Amber
            '#7c3aed', // Violet
        ];

        return [
            'datasets' => [
                [
                    'label' => 'Total Views',
                    'data' => $data,
                    'backgroundColor' => array_slice($colors, 0, count($data)),
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
