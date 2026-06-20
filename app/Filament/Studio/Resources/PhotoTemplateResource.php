<?php

namespace App\Filament\Studio\Resources;

use App\Filament\Studio\Resources\PhotoTemplateResource\Pages;
use App\Filament\Studio\Resources\PhotoTemplateResource\RelationManagers;
use App\Models\PhotoTemplate;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PhotoTemplateResource extends Resource
{
    protected static ?string $model = PhotoTemplate::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'Nalaruang Studio';
    protected static ?string $navigationLabel = 'Template Foto';
    protected static ?string $pluralModelLabel = 'Template Foto';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->label('Nama Template')
                            ->maxLength(255),
                        Forms\Components\FileUpload::make('frame_image')
                            ->image()
                            ->required()
                            ->label('Gambar Template (PNG Transparan)')
                            ->directory('photo_templates')
                            ->acceptedFileTypes(['image/png'])
                            ->helperText('Gunakan format PNG dengan latar belakang transparan pada bagian lubang fotonya.'),
                        Forms\Components\TextInput::make('cut_count')
                            ->required()
                            ->numeric()
                            ->default(4)
                            ->label('Jumlah Potongan Foto (Cuts)')
                            ->minValue(1)
                            ->maxValue(10),
                        Forms\Components\TextInput::make('price')
                            ->numeric()
                            ->label('Harga (Opsional)')
                            ->prefix('Rp'),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Aktif')
                            ->default(true),
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('frame_image')
                    ->label('Template')
                    ->square(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('cut_count')
                    ->label('Jumlah Cut')
                    ->sortable(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Harga')
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Status')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
            'index' => Pages\ListPhotoTemplates::route('/'),
            'create' => Pages\CreatePhotoTemplate::route('/create'),
            'edit' => Pages\EditPhotoTemplate::route('/{record}/edit'),
        ];
    }
}
