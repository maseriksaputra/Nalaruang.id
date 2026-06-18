<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FinancialLogResource\Pages;
use App\Filament\Resources\FinancialLogResource\RelationManagers;
use App\Models\FinancialLog;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class FinancialLogResource extends Resource
{
    protected static ?string $model = FinancialLog::class;

    protected static ?string $navigationIcon = 'heroicon-o-shield-check';
    protected static ?string $navigationGroup = 'Transaksi & Keuangan';
    protected static ?string $modelLabel = 'Log Audit Keuangan';
    protected static ?string $pluralModelLabel = 'Log Audit Keuangan';
    protected static ?int $navigationSort = 10;

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canEdit(Model $record): bool
    {
        return false;
    }

    public static function canDelete(Model $record): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('action')
                    ->label('Aksi'),
                Forms\Components\TextInput::make('description')
                    ->label('Deskripsi'),
                Forms\Components\KeyValue::make('old_data')
                    ->label('Data Lama')
                    ->disabled(),
                Forms\Components\KeyValue::make('new_data')
                    ->label('Data Baru')
                    ->disabled(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Waktu')
                    ->dateTime('d M Y H:i:s')
                    ->sortable(),
                Tables\Columns\TextColumn::make('action')
                    ->label('Aksi')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'created' => 'success',
                        'updated' => 'warning',
                        'deleted' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('description')
                    ->label('Deskripsi Log')
                    ->searchable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('action')
                    ->options([
                        'created' => 'Dibuat',
                        'updated' => 'Diedit',
                        'deleted' => 'Dihapus',
                    ])
                    ->label('Filter Aksi'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                // No bulk actions for audit logs
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFinancialLogs::route('/'),
        ];
    }
}
