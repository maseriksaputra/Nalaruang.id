<?php

namespace App\Filament\Pages;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Pages\Dashboard\Concerns\HasFiltersAction;
use Filament\Pages\Dashboard\Actions\FilterAction;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    use HasFiltersAction;

    protected function getHeaderActions(): array
    {
        return [
            FilterAction::make()
                ->label('Filter Dashboard')
                ->form([
                    Select::make('period')
                        ->label('Pilih Rentang Waktu')
                        ->options([
                            'all' => 'Semua Waktu',
                            'today' => 'Hari Ini',
                            'yesterday' => 'Kemarin',
                            'this_week' => 'Minggu Ini',
                            'last_week' => 'Minggu Lalu',
                            'this_month' => 'Bulan Ini',
                            'last_month' => 'Bulan Lalu',
                            '30_days' => '30 Hari Terakhir',
                            'this_year' => 'Tahun Ini',
                            'custom' => 'Pilih Tanggal Manual...',
                        ])
                        ->default('all')
                        ->live(),
                    DatePicker::make('startDate')
                        ->label('Dari Tanggal')
                        ->live()
                        ->visible(fn (\Filament\Forms\Get $get) => $get('period') === 'custom'),
                    DatePicker::make('endDate')
                        ->label('Sampai Tanggal')
                        ->live()
                        ->visible(fn (\Filament\Forms\Get $get) => $get('period') === 'custom'),
                ]),
        ];
    }
}
