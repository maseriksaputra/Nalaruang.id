<?php

namespace App\Filament\Resources;

use App\Filament\Resources\InvitationVisitorResource\Pages;
use App\Filament\Resources\InvitationVisitorResource\RelationManagers;
use App\Models\InvitationVisitor;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class InvitationVisitorResource extends Resource
{
    protected static ?string $model = InvitationVisitor::class;

    protected static ?string $navigationIcon = 'heroicon-o-cursor-arrow-rays';
    protected static ?string $navigationGroup = 'Lalu Lintas & Tamu';
    protected static ?string $modelLabel = 'Kunjungan';
    protected static ?string $pluralModelLabel = 'Log Kunjungan';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('invitation_id')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('ip_address'),
                Forms\Components\Textarea::make('user_agent')
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('invitation_id')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('ip_address')
                    ->searchable(),
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
            'index' => Pages\ListInvitationVisitors::route('/'),
            'create' => Pages\CreateInvitationVisitor::route('/create'),
            'edit' => Pages\EditInvitationVisitor::route('/{record}/edit'),
        ];
    }
}
