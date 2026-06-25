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
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('invitation_id')
                    ->label('Sumber Kunjungan')
                    ->formatStateUsing(function ($state, $record) {
                        if (is_null($state)) {
                            return 'Halaman Utama (Nalaruang.id)';
                        }
                        return $record->invitation ? $record->invitation->title : ('Undangan #' . $state);
                    })
                    ->badge()
                    ->color(fn ($state) => is_null($state) ? 'success' : 'primary')
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->whereHas('invitation', function ($q) use ($search) {
                            $q->where('title', 'like', "%{$search}%");
                        })->orWhere('invitation_id', 'like', "%{$search}%");
                    }),
                Tables\Columns\TextColumn::make('ip_address')
                    ->label('IP Address')
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Waktu Kunjungan')
                    ->dateTime('d M Y, H:i:s')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: false),
                Tables\Columns\TextColumn::make('user_agent')
                    ->label('Perangkat / Browser')
                    ->limit(50)
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('kategori_layanan')
                    ->label('Filter Kategori Layanan')
                    ->options([
                        'halaman_utama' => 'Halaman Utama (Nalaruang.id)',
                        'cetak-fisik-premium' => 'Cetak Fisik',
                        'event-digital' => 'Event Digital',
                        'souvenir-merchandise' => 'Souvenir & Merchandise',
                        'web-mobile-app' => 'Web & Mobile App',
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        $value = $data['value'] ?? null;
                        if (!$value) return $query;
                        
                        if ($value === 'halaman_utama') {
                            return $query->whereNull('invitation_id');
                        }

                        return $query->whereHas('invitation', function ($q) use ($value) {
                            $q->whereHas('order.template.service', function ($q2) use ($value) {
                                $q2->where('slug', $value);
                            })->orWhere(function ($q3) use ($value) {
                                // Subquery untuk mencari invitation yang merupakan template demo
                                $q3->whereExists(function ($q4) use ($value) {
                                    $q4->select(\Illuminate\Support\Facades\DB::raw(1))
                                       ->from('templates')
                                       ->join('services', 'templates.service_id', '=', 'services.id')
                                       ->whereColumn('templates.invitation_id', 'invitations.id')
                                       ->where('services.slug', $value);
                                });
                            });
                        });
                    }),
            ])
            ->actions([
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
            'index' => Pages\ListInvitationVisitors::route('/'),
            'create' => Pages\CreateInvitationVisitor::route('/create'),
            'edit' => Pages\EditInvitationVisitor::route('/{record}/edit'),
        ];
    }
}
