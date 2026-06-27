<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductPriceResource\Pages;
use App\Models\Category;
use App\Models\ProductPrice;
use App\Models\Service;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Collection;

class ProductPriceResource extends Resource
{
    protected static ?string $model = ProductPrice::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';
    protected static ?string $navigationGroup = 'Manajemen Toko';
    protected static ?string $modelLabel = 'Harga Produk';
    protected static ?string $pluralModelLabel = 'Harga Produk';
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make()->schema([
                    Forms\Components\Select::make('service_id')
                        ->label('Layanan')
                        ->options(Service::query()->pluck('title', 'id'))
                        ->required()
                        ->live() // to trigger dependent dropdown
                        ->afterStateUpdated(fn (callable $set) => $set('category_id', null)),

                    Forms\Components\Select::make('category_id')
                        ->label('Kategori')
                        ->options(fn (Get $get): Collection => Category::query()
                            ->where('service_id', $get('service_id'))
                            ->pluck('name', 'id'))
                        ->searchable()
                        ->preload()
                        ->nullable()
                        ->helperText('Pilih kategori (opsional tergantung layanan)'),

                    Forms\Components\TextInput::make('name')
                        ->label('Nama Produk/Ukuran')
                        ->required()
                        ->maxLength(255)
                        ->placeholder('Misal: 2x3, Es Teh Manis, dll.'),

                    Forms\Components\TextInput::make('description')
                        ->label('Dimensi/Deskripsi Singkat')
                        ->maxLength(255)
                        ->placeholder('Misal: 2 x 3 cm'),

                    Forms\Components\TextInput::make('price')
                        ->label('Harga')
                        ->required()
                        ->numeric()
                        ->prefix('Rp')
                        ->default(0),


                    Forms\Components\Toggle::make('is_active')
                        ->label('Aktif')
                        ->default(true),
                ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\Layout\View::make('filament.tables.columns.product-price-card'),
            ])
            ->contentGrid([
                'md' => 3,
                'lg' => 4,
                'xl' => 5,
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make()->iconButton(),
                Tables\Actions\DeleteAction::make()->iconButton(),
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
            'index' => Pages\ListProductPrices::route('/'),
            'create' => Pages\CreateProductPrice::route('/create'),
            'edit' => Pages\EditProductPrice::route('/{record}/edit'),
        ];
    }
}
