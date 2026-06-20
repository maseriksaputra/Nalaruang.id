<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Order;

class OrderStatsOverview extends BaseWidget
{
    protected static bool $isLazy = true;
    protected static ?int $sort = 4;
    protected static ?string $pollingInterval = null;

    protected function getStats(): array
    {
        return [
            Stat::make('Total Pesanan', Order::count())
                ->description('Total keseluruhan pesanan masuk')
                ->descriptionIcon('heroicon-m-shopping-cart')
                ->color('primary'),

            Stat::make('Pesanan Pending', Order::where('status', 'pending')->count())
                ->description('Menunggu diproses')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),

            Stat::make('Diproses & Revisi', Order::whereIn('status', ['diproses', 'revisi'])->count())
                ->description('Sedang dikerjakan')
                ->descriptionIcon('heroicon-m-cog')
                ->color('info'),

            Stat::make('Pesanan Selesai', Order::where('status', 'selesai')->count())
                ->description('Pesanan telah selesai')
                ->descriptionIcon('heroicon-m-check-badge')
                ->color('success'),
        ];
    }
}
