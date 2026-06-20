<?php

namespace App\Filament\Studio\Resources;

use App\Filament\Studio\Resources\PhotoSessionResource\Pages;
use App\Filament\Studio\Resources\PhotoSessionResource\RelationManagers;
use App\Models\PhotoSession;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PhotoSessionResource extends Resource
{
    protected static ?string $model = PhotoSession::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'Nalaruang Studio';
    protected static ?string $navigationLabel = 'Riwayat Foto';
    protected static ?string $pluralModelLabel = 'Riwayat Foto';

    // Disable creating manually
    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->contentGrid([
                'md' => 2,
                'xl' => 4,
            ])
            ->columns([
                Tables\Columns\Layout\Stack::make([
                    Tables\Columns\ImageColumn::make('final_image')
                        ->height('auto')
                        ->width('100%')
                        ->extraImgAttributes(['class' => 'rounded-xl shadow-md border-4 border-white transform hover:scale-105 transition-transform duration-300']),
                    
                    Tables\Columns\Layout\Stack::make([
                        Tables\Columns\TextColumn::make('customer_name')
                            ->weight('bold')
                            ->size('lg'),
                        Tables\Columns\TextColumn::make('created_at')
                            ->dateTime('d M Y, H:i')
                            ->color('gray'),
                        Tables\Columns\TextColumn::make('template.name')
                            ->badge()
                            ->color('success')
                            ->icon('heroicon-m-swatch'),
                    ])->space(1)->extraAttributes(['class' => 'mt-4 bg-white/80 backdrop-blur p-4 rounded-xl shadow-sm']),
                ])->space(0),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\DeleteAction::make()
                    ->iconButton(),
                Tables\Actions\Action::make('print')
                    ->icon('heroicon-o-printer')
                    ->iconButton()
                    ->color('info')
                    ->url(fn ($record) => asset('storage/' . $record->final_image))
                    ->openUrlInNewTab(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
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
            'index' => Pages\ListPhotoSessions::route('/'),
            'create' => Pages\CreatePhotoSession::route('/create'),
            'edit' => Pages\EditPhotoSession::route('/{record}/edit'),
        ];
    }
}
