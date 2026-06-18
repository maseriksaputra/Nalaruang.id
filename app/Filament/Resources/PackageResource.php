<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PackageResource\Pages;
use App\Filament\Resources\PackageResource\RelationManagers;
use App\Models\Package;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PackageResource extends Resource
{
    protected static ?string $model = Package::class;

    protected static ?string $modelLabel = 'Paket Harga';
    protected static ?string $pluralModelLabel = 'Daftar Paket';
    protected static ?string $navigationLabel = 'Paket Harga';
    protected static ?string $navigationGroup = 'Manajemen Toko';
    protected static ?int $navigationSort = 2;

    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('service_id')
                    ->relationship('service', 'title')
                    ->required()
                    ->label('Layanan Induk'),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->label('Nama Paket'),
                Forms\Components\TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('Rp')
                    ->label('Harga Paket'),
                Forms\Components\Textarea::make('description')
                    ->columnSpanFull()
                    ->label('Deskripsi Singkat'),
                Forms\Components\TagsInput::make('features')
                    ->columnSpanFull()
                    ->separator(',')
                    ->label('Fitur (Ketik lalu tekan Enter)'),
                Forms\Components\Toggle::make('is_popular')
                    ->required()
                    ->label('Paket Terpopuler?'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->withCount('orders'))
            ->columns([
                Tables\Columns\TextColumn::make('service.title')
                    ->sortable()
                    ->label('Layanan Induk'),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->label('Nama Paket'),
                Tables\Columns\TextColumn::make('price')
                    ->formatStateUsing(fn ($state) => 'Rp ' . number_format($state ?? 0, 0, ',', '.'))
                    ->sortable()
                    ->label('Harga'),
                Tables\Columns\TextColumn::make('orders_count')
                    ->label('Jumlah Pembelian')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_popular')
                    ->boolean()
                    ->label('Terpopuler'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('service_id')
                    ->relationship('service', 'title')
                    ->label('Layanan Induk'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListPackages::route('/'),
            'create' => Pages\CreatePackage::route('/create'),
            'edit' => Pages\EditPackage::route('/{record}/edit'),
        ];
    }
}
