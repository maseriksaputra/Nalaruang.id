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
    protected static ?string $heading = 'Undangan Paling Ramai (Top Invitations)';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Invitation::query()
                    ->select('invitations.id', 'invitations.title', 'invitations.slug', 'invitations.status', 'invitations.thumbnail_path')
                    ->leftJoin('templates', 'invitations.id', '=', 'templates.invitation_id')
                    ->withCount('visitors')
                    ->selectRaw('COALESCE(templates.demo_views, 0) + COALESCE(templates.total_invitation_views, 0) as template_views')
                    ->orderByRaw('GREATEST(visitors_count, COALESCE(templates.demo_views, 0) + COALESCE(templates.total_invitation_views, 0)) desc')
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\ImageColumn::make('thumbnail_path')
                    ->label('Sampul')
                    ->circular(),
                Tables\Columns\TextColumn::make('title')
                    ->label('Judul / Klien')
                    ->searchable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'published' => 'success',
                        'draft' => 'gray',
                        'archived' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('visitors_count')
                    ->label('Total Kunjungan')
                    ->getStateUsing(function (Invitation $record) {
                        $templateViews = $record->template_views ?? 0;
                        return max($record->visitors_count ?? 0, $templateViews);
                    })
                    ->badge()
                    ->color('primary')
                    ->icon('heroicon-m-eye'),
            ])
            ->actions([
                Tables\Actions\Action::make('open')
                    ->label('Buka')
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->url(fn (Invitation $record): string => url('/' . $record->slug))
                    ->openUrlInNewTab(),
            ]);
    }
}
