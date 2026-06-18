<?php

namespace App\Filament\Widgets;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use App\Models\Template;
use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;

class TopProductsTable extends BaseWidget
{
    protected static bool $isLazy = true;

    protected static ?int $sort = 11;
    protected int | string | array $columnSpan = 'full';
    protected static ?string $heading = 'Peringkat Layanan / Produk Terlaris';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Template::withCount('orders')
                    ->withSum('orders', 'total_price')
                    ->orderBy('orders_count', 'desc')
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Layanan/Produk')
                    ->searchable(),
                Tables\Columns\TextColumn::make('serviceCategory.name')
                    ->label('Kategori')
                    ->sortable(),
                Tables\Columns\TextColumn::make('orders_count')
                    ->label('Total Terjual')
                    ->sortable(),
                Tables\Columns\TextColumn::make('orders_sum_total_price')
                    ->label('Total Pendapatan')
                    ->formatStateUsing(fn ($state) => 'Rp ' . number_format($state ?? 0, 0, ',', '.'))
                    ->sortable(),
            ])
            ->paginated(false);
    }
}
