<?php

namespace App\Filament\Widgets;

use App\Models\Guest;
use App\Models\InvitationVisitor;
use App\Models\Rsvp;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class GuestEngagementStats extends BaseWidget
{
    protected int | string | array $columnSpan = 'full';

    protected static bool $isLazy = true;

    protected static ?int $sort = 7;

    protected function getStats(): array
    {
        $totalVisitors = InvitationVisitor::count();
        $totalGuests = Guest::count();
        $totalRsvp = Rsvp::count();

        // Calculate engagement percentage safely
        $engagementRate = $totalGuests > 0 ? round(($totalVisitors / $totalGuests) * 100, 1) : 0;
        
        return [
            Stat::make('Total Tamu Disebar', number_format($totalGuests))
                ->description('Jumlah nama tamu yang di-generate')
                ->descriptionIcon('heroicon-m-users')
                ->color('primary')
                ->url(\App\Filament\Resources\GuestResource::getUrl('index'))
                ->extraAttributes(['style' => 'background-color: rgba(99, 102, 241, 0.05);']),

            Stat::make('Total Kunjungan Server', number_format($totalVisitors))
                ->description('Total klik undangan (' . $engagementRate . '% engagement)')
                ->descriptionIcon('heroicon-m-cursor-arrow-rays')
                ->color('success')
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->url(\App\Filament\Resources\InvitationVisitorResource::getUrl('index'))
                ->extraAttributes(['style' => 'background-color: rgba(16, 185, 129, 0.05);']),

            Stat::make('Total RSVP Masuk', number_format($totalRsvp))
                ->description('Buku tamu / konfirmasi kehadiran')
                ->descriptionIcon('heroicon-m-check-badge')
                ->color('warning')
                ->url(\App\Filament\Resources\RsvpResource::getUrl('index'))
                ->extraAttributes(['style' => 'background-color: rgba(245, 158, 11, 0.05);']),
        ];
    }
}
