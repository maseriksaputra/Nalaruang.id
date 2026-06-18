<?php

namespace App\Filament\Resources\CashflowResource\Pages;

use App\Filament\Resources\CashflowResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCashflows extends ListRecords
{
    protected static string $resource = CashflowResource::class;



    #[\Livewire\Attributes\Url]
    public ?array $customFilters = ['period' => 'all'];

    protected function getHeaderWidgets(): array
    {
        return [
            CashflowResource\Widgets\CashflowStats::class,
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\Action::make('filter')
                ->label('Filter Buku Kas')
                ->icon('heroicon-m-funnel')
                ->color('gray')
                ->form([
                    \Filament\Forms\Components\Select::make('period')
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
                        ->default($this->customFilters['period'] ?? 'all')
                        ->live(),
                    \Filament\Forms\Components\DatePicker::make('startDate')
                        ->label('Dari Tanggal')
                        ->default($this->customFilters['startDate'] ?? null)
                        ->visible(fn (\Filament\Forms\Get $get) => $get('period') === 'custom'),
                    \Filament\Forms\Components\DatePicker::make('endDate')
                        ->label('Sampai Tanggal')
                        ->default($this->customFilters['endDate'] ?? null)
                        ->visible(fn (\Filament\Forms\Get $get) => $get('period') === 'custom'),
                ])
                ->action(function (array $data) {
                    $this->customFilters = $data;
                })
                ->slideOver(),
            \Filament\Actions\CreateAction::make(),
        ];
    }

    protected function getTableQuery(): ?\Illuminate\Database\Eloquent\Builder
    {
        $query = parent::getTableQuery();
        $data = $this->customFilters ?? [];
        $period = $data['period'] ?? 'all';

        if ($period && $period !== 'all' && $period !== 'custom') {
            $now = now();
            match ($period) {
                'today' => $query->whereDate('transaction_date', clone $now),
                'yesterday' => $query->whereDate('transaction_date', (clone $now)->subDay()),
                'this_week' => $query->whereBetween('transaction_date', [(clone $now)->startOfWeek(), (clone $now)->endOfWeek()]),
                'last_week' => $query->whereBetween('transaction_date', [(clone $now)->subWeek()->startOfWeek(), (clone $now)->subWeek()->endOfWeek()]),
                'this_month' => $query->whereMonth('transaction_date', $now->month)->whereYear('transaction_date', $now->year),
                'last_month' => $query->whereMonth('transaction_date', (clone $now)->subMonth()->month)->whereYear('transaction_date', (clone $now)->subMonth()->year),
                '30_days' => $query->whereDate('transaction_date', '>=', (clone $now)->subDays(30)),
                'this_year' => $query->whereYear('transaction_date', $now->year),
                default => null,
            };
        } elseif ($period === 'custom') {
            $query->when($data['startDate'] ?? null, fn ($q, $date) => $q->whereDate('transaction_date', '>=', $date))
                  ->when($data['endDate'] ?? null, fn ($q, $date) => $q->whereDate('transaction_date', '<=', $date));
        }

        return $query;
    }
}
