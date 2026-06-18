<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CashierProductResource\Pages;
use App\Filament\Resources\CashierProductResource\RelationManagers;
use App\Models\CashierProduct;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CashierProductResource extends Resource
{
    protected static ?string $model = CashierProduct::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';
    protected static ?string $navigationGroup = 'Transaksi & Keuangan';
    protected static ?string $modelLabel = 'Produk Kasir';
    protected static ?string $pluralModelLabel = 'Produk Kasir';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('category')
                    ->options([
                        'F&B' => 'F&B',
                        'ATK' => 'ATK',
                        'Printing' => 'Printing',
                        'Digital' => 'Digital',
                    ])
                    ->required()
                    ->label('Kategori'),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->label('Nama Produk'),
                Forms\Components\TextInput::make('default_price')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->prefix('Rp')
                    ->label('Harga Default'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Produk')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'F&B' => 'warning',
                        'ATK' => 'info',
                        'Printing' => 'success',
                        'Digital' => 'primary',
                        default => 'gray',
                    })
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('default_price')
                    ->label('Harga Default')
                    ->money('IDR', locale: 'id')
                    ->sortable(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Terakhir Diupdate')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('updated_at', 'desc')
            ->defaultPaginationPageOption(50)
            ->paginationPageOptions([10, 25, 50, 100, 'all'])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        'F&B' => 'F&B',
                        'ATK' => 'ATK',
                        'Printing' => 'Printing',
                        'Digital' => 'Digital',
                    ])
                    ->label('Filter Kategori'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
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
            'index' => Pages\ListCashierProducts::route('/'),
            'create' => Pages\CreateCashierProduct::route('/create'),
            'edit' => Pages\EditCashierProduct::route('/{record}/edit'),
        ];
    }
}
