<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PortfolioResource\Pages;
use App\Models\Portfolio;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\IconColumn;

class PortfolioResource extends Resource
{
    protected static ?string $model = Portfolio::class;

    protected static ?string $navigationIcon = 'heroicon-o-sparkles';
    protected static ?string $navigationGroup = 'Konten Website';
    protected static ?string $modelLabel = 'Portofolio';
    protected static ?string $pluralModelLabel = 'Karya Portofolio';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('title')->required()->maxLength(255),
                Select::make('category')->options([
                    'Cetak Fisik Premium' => 'Cetak Fisik Premium',
                    'Event Digital' => 'Event Digital',
                    'Souvenir & Merchandise' => 'Souvenir & Merchandise',
                    'Web & Mobile App' => 'Web & Mobile App',
                ])->required(),
                FileUpload::make('image')->image()->directory('portfolios'),
                FileUpload::make('video')
                    ->directory('portfolios/videos')
                    ->acceptedFileTypes(['video/mp4', 'video/webm', 'video/ogg'])
                    ->maxSize(10240) // 10MB max
                    ->helperText('Maksimal 10MB. Gunakan resolusi kecil agar ringan saat diload di landing page.'),
                Select::make('aspect_ratio')
                    ->options([
                        'aspect-square' => '1:1 (Persegi)',
                        'aspect-video' => '16:9 (Landscape / Layar Lebar)',
                        'aspect-[9/16]' => '9:16 (Portrait / Reels)',
                        'aspect-[4/3]' => '4:3 (Landscape Standar)',
                        'aspect-[3/4]' => '3:4 (Portrait Standar)',
                        'aspect-[3/2]' => '3:2 (Foto Landscape)',
                        'aspect-[2/3]' => '2:3 (Foto Portrait)',
                    ])
                    ->default('aspect-square')
                    ->required(),
                TextInput::make('sort_order')->numeric()->default(0),
                Toggle::make('is_active')->default(true)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image'),
                TextColumn::make('title')->searchable(),
                TextColumn::make('category')->searchable(),
                TextColumn::make('sort_order')->sortable(),
                IconColumn::make('is_active')->boolean()
            ])
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array { return []; }
    public static function getPages(): array {
        return [
            'index' => Pages\ListPortfolios::route('/'),
            'create' => Pages\CreatePortfolio::route('/create'),
            'edit' => Pages\EditPortfolio::route('/{record}/edit'),
        ];
    }
}