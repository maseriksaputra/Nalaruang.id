<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CategoryResource\Pages;
use App\Filament\Resources\CategoryResource\RelationManagers;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static ?string $modelLabel = 'Katalog';
    protected static ?string $pluralModelLabel = 'Daftar Katalog';
    protected static ?string $navigationLabel = 'Katalog Utama';
    protected static ?string $navigationGroup = 'Manajemen Toko';
    protected static ?int $navigationSort = 3;

    protected static ?string $navigationIcon = 'heroicon-o-folder';

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
                    ->label('Nama Katalog'),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->label('Slug (URL)'),
                Forms\Components\Textarea::make('description')
                    ->columnSpanFull()
                    ->label('Deskripsi Katalog'),
                Forms\Components\Select::make('form_type')
                    ->options([
                        'undangan' => 'Form Undangan Fisik',
                        'yasin' => 'Form Buku Yasin',
                        'print' => 'Form Print / Fotocopy',
                        'lanyard' => 'Form Lanyard / ID Card',
                        'default' => 'Form Standar',
                    ])
                    ->required()
                    ->label('Tipe Form Pemesanan'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('service.title')
                    ->sortable()
                    ->label('Layanan Induk'),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->label('Nama Katalog'),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable(),
                Tables\Columns\BadgeColumn::make('form_type')
                    ->label('Tipe Form')
                    ->colors([
                        'primary' => 'default',
                        'success' => 'yasin',
                        'warning' => 'print',
                        'danger' => 'lanyard',
                        'info' => 'undangan',
                    ]),
            ])
            ->filters([
                //
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
            'index' => Pages\ListCategories::route('/'),
            'create' => Pages\CreateCategory::route('/create'),
            'edit' => Pages\EditCategory::route('/{record}/edit'),
        ];
    }
}
