<?php

namespace App\Filament\Resources\TemplateResource\Widgets;

use App\Models\Template;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Livewire\Attributes\Reactive;

class TemplateStatsOverview extends BaseWidget
{
    #[Reactive]
    public ?string $activeTab = null;

    protected function getBaseQuery()
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

        return $query;
    }

    protected function getStats(): array
    {
        $stats = $this->getBaseQuery()
            ->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count,
                SUM(CASE WHEN stok < 10 AND stok > 0 THEN 1 ELSE 0 END) as low_stock,
                SUM(CASE WHEN stok <= 0 THEN 1 ELSE 0 END) as out_of_stock,
                SUM(COALESCE(demo_views, 0)) + SUM(COALESCE(total_invitation_views, 0)) as total_views
            ')
            ->first();
        
        $total = $stats->total ?? 0;
        $active = $stats->active_count ?? 0;
        $lowStock = $stats->low_stock ?? 0;
        $outOfStock = $stats->out_of_stock ?? 0;
        $totalViews = $stats->total_views ?? 0;

        // Get invitation IDs for the current filtered templates
        $invitationIds = $this->getBaseQuery()->whereNotNull('invitation_id')->pluck('invitation_id')->toArray();
        
        // Calculate chart data for the last 7 days
        $chartData = [];
        $totalViews7Days = 0;
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $count = \App\Models\InvitationVisitor::whereIn('invitation_id', $invitationIds)
                ->whereDate('created_at', $date)
                ->count();
            $chartData[] = $count;
            $totalViews7Days += $count;
        }

        return [
            Stat::make('Total View Produk', number_format($totalViews, 0, ',', '.'))
                ->description('Berdasarkan filter aktif')
                ->descriptionIcon('heroicon-m-eye')
                ->color('info'),
            Stat::make('Total Produk', number_format($total, 0, ',', '.'))
                ->description('Semua produk')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('primary'),
            Stat::make('Produk Aktif', number_format($active, 0, ',', '.'))
                ->description('Ditampilkan di web')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),
            Stat::make('Stok Rendah', $lowStock)
                ->description('< 10 stok tersisa')
                ->descriptionIcon('heroicon-m-exclamation-triangle')
                ->color('warning'),
            Stat::make('Habis Stok', $outOfStock)
                ->description('Kosong')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger'),
            Stat::make('View Harian (7 Hari)', number_format($totalViews7Days, 0, ',', '.'))
                ->description('Trend 7 hari terakhir')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart($chartData)
                ->color($totalViews7Days > 0 ? 'success' : 'gray'),
        ];
    }
}
