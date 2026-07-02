<?php

namespace App\Filament\Widgets;

use App\Models\Invitation;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class TopInvitationsTable extends BaseWidget
{
    protected static bool $isLazy = true;

    protected static ?int $sort = 10;
    protected int | string | array $columnSpan = 'full';
    protected static ?string $heading = 'Produk Paling Ramai (Top Products)';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                \App\Models\Template::query()
                    ->select('id', 'name', 'is_active', 'image', 'preview_url')
                    ->selectRaw('COALESCE(demo_views, 0) + COALESCE(total_invitation_views, 0) as total_views')
                    ->orderByRaw('COALESCE(demo_views, 0) + COALESCE(total_invitation_views, 0) desc')
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('Sampul')
                    ->circular(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Judul Produk')
                    ->searchable()
                    ->weight('bold'),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Status Aktif')
                    ->boolean(),
                Tables\Columns\TextColumn::make('total_views')
                    ->label('Total Kunjungan')
                    ->badge()
                    ->color('primary')
                    ->icon('heroicon-m-eye'),
            ])
            ->actions([
                Tables\Actions\Action::make('open')
                    ->label('Buka')
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->url(fn (\App\Models\Template $record): string => $record->preview_url ?? url('/p/' . $record->id))
                    ->openUrlInNewTab(),
            ]);
    }
}
