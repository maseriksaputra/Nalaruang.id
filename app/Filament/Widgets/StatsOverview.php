<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;
    protected static bool $isLazy = true;

    protected function getStats(): array
    {
        $income = \App\Models\Cashflow::where('type', 'income')->sum('amount');
        $expense = \App\Models\Cashflow::where('type', 'expense')->sum('amount');
        $net = $income - $expense;
        $orderCount = \App\Models\Cashflow::where('reference_type', 'App\Models\Order')->count();

        $formatValue = function ($amount) {
            $val = 'Rp ' . number_format($amount, 0, ',', '.');
            return new \Illuminate\Support\HtmlString('<span class="text-2xl xl:text-3xl tracking-tighter whitespace-nowrap">' . $val . '</span>');
        };

        return [
            Stat::make('Total Pendapatan', $formatValue($income))
                ->description('Seluruh kas masuk')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success')
                ->url(\App\Filament\Resources\CashflowResource::getUrl('index'))
                ->extraAttributes(['style' => 'background-color: rgba(16, 185, 129, 0.05);']),
            Stat::make('Total Pengeluaran', $formatValue($expense))
                ->description('Seluruh kas keluar')
                ->descriptionIcon('heroicon-m-arrow-trending-down')
                ->color('danger')
                ->url(\App\Filament\Resources\CashflowResource::getUrl('index'))
                ->extraAttributes(['style' => 'background-color: rgba(239, 68, 68, 0.05);']),
            Stat::make('Laba Bersih', $formatValue($net))
                ->description('Pendapatan - Pengeluaran')
                ->color($net >= 0 ? 'success' : 'danger')
                ->url(\App\Filament\Resources\CashflowResource::getUrl('index'))
                ->extraAttributes(['style' => $net >= 0 ? 'background-color: rgba(16, 185, 129, 0.05);' : 'background-color: rgba(239, 68, 68, 0.05);']),
            Stat::make('Total Penjualan', new \Illuminate\Support\HtmlString('<span class="text-2xl xl:text-3xl tracking-tighter whitespace-nowrap">' . $orderCount . ' Pesanan</span>'))
                ->description('Berdasarkan pesanan tercatat')
                ->color('primary')
                ->url(\App\Filament\Resources\OrderResource::getUrl('index'))
                ->extraAttributes(['style' => 'background-color: rgba(99, 102, 241, 0.05);']),
        ];
    }
}
