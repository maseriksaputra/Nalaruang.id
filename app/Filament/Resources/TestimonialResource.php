<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TestimonialResource\Pages;
use App\Models\Testimonial;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\IconColumn;

class TestimonialResource extends Resource
{
    protected static ?string $model = Testimonial::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';
    protected static ?string $navigationGroup = 'Konten Website';
    protected static ?string $modelLabel = 'Testimoni Klien';
    protected static ?string $pluralModelLabel = 'Ulasan Pelanggan';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('client_name')->required()->maxLength(255),
                TextInput::make('role')->maxLength(255),
                Textarea::make('content')->required(),
                FileUpload::make('avatar')->image()->directory('avatars'),
                TextInput::make('sort_order')->numeric()->default(0),
                Toggle::make('is_active')->default(true)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('avatar'),
                TextColumn::make('client_name')->searchable(),
                TextColumn::make('role'),
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
            'index' => Pages\ListTestimonials::route('/'),
            'create' => Pages\CreateTestimonial::route('/create'),
            'edit' => Pages\EditTestimonial::route('/{record}/edit'),
        ];
    }
}