<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CashflowResource\Pages;
use App\Filament\Resources\CashflowResource\RelationManagers;
use App\Models\Cashflow;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CashflowResource extends Resource
{
    protected static ?string $model = Cashflow::class;

    protected static ?string $navigationIcon = 'heroicon-o-banknotes';
    protected static ?string $navigationGroup = 'Transaksi & Keuangan';
    protected static ?string $modelLabel = 'Arus Kas';
    protected static ?string $pluralModelLabel = 'Buku Kas';
    protected static ?int $navigationSort = 1;

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
                        'Tabungan BEP' => 'Tabungan BEP',
                    ])
                    ->required()
                    ->label('Kategori'),
                Forms\Components\ToggleButtons::make('type')
                    ->options([
                        'income' => 'Pemasukan (+)',
                        'expense' => 'Pengeluaran (-)',
                    ])
                    ->colors([
                        'income' => 'success',
                        'expense' => 'danger',
                    ])
                    ->inline()
                    ->required()
                    ->label('Tipe Transaksi'),
                Forms\Components\DatePicker::make('transaction_date')
                    ->required()
                    ->label('Tanggal')
                    ->default(now()),
                Forms\Components\TextInput::make('description')
                    ->required()
                    ->maxLength(255)
                    ->label('Nama Produk / Ket.'),
                Forms\Components\TextInput::make('quantity')
                    ->required()
                    ->numeric()
                    ->default(1)
                    ->label('Qty'),
                Forms\Components\TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('Rp')
                    ->label('Harga Satuan'),
                Forms\Components\TextInput::make('amount')
                    ->required()
                    ->numeric()
                    ->prefix('Rp')
                    ->label('Total Nominal'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('description')
                    ->label('Nama Transaksi')
                    ->weight('bold')
                    ->description(fn (\App\Models\Cashflow $record): string => $record->category ?? '')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'F&B' => 'warning',
                        'ATK' => 'info',
                        'Printing' => 'success',
                        'Digital' => 'primary',
                        'Tabungan BEP' => 'indigo',
                        default => 'gray',
                    })
                    ->toggleable(isToggledHiddenByDefault: true),
                    
                Tables\Columns\TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => $state === 'income' ? 'Masuk' : 'Keluar')
                    ->color(fn (string $state): string => $state === 'income' ? 'success' : 'danger'),
                    
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Qty')
                    ->numeric()
                    ->alignCenter(),
                    
                Tables\Columns\TextColumn::make('price')
                    ->label('Harga Satuan')
                    ->formatStateUsing(fn ($state) => 'Rp ' . number_format($state ?? 0, 0, ',', '.'))
                    ->alignRight()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('amount')
                    ->label('Total')
                    ->formatStateUsing(fn ($state) => ($state < 0 ? '-' : '') . 'Rp ' . number_format(abs($state ?? 0), 0, ',', '.'))
                    ->color(fn (\App\Models\Cashflow $record): string => $record->type === 'income' ? 'success' : 'danger')
                    ->weight('bold')
                    ->alignRight()
                    ->sortable(),
            ])
            ->striped()
            ->defaultSort('transaction_date', 'desc')
            ->defaultGroup('transaction_date')
            ->groups([
                Tables\Grouping\Group::make('transaction_date')
                    ->label('') // Hide prefix
                    ->date() // Use native date grouping (bulletproof)
                    ->collapsible(false) // Standard table layout
                    ->orderQueryUsing(fn (\Illuminate\Database\Eloquent\Builder $query, string $direction) => $query->orderBy('transaction_date', 'desc'))
                    ->getDescriptionFromRecordUsing(function (\App\Models\Cashflow $record) {
                        $date = \Carbon\Carbon::parse($record->transaction_date)->format('Y-m-d');
                        $income = \App\Models\Cashflow::whereDate('transaction_date', $date)->where('type', 'income')->sum('amount') ?? 0;
                        $expense = \App\Models\Cashflow::whereDate('transaction_date', $date)->where('type', 'expense')->sum('amount') ?? 0;
                        
                        // Expense is saved as negative in database, so net is income + expense
                        $net = $income + $expense;
                        
                        $netColorHex = $net >= 0 ? '#16a34a' : '#dc2626';
                        $netSign = $net < 0 ? '-' : '';
                        
                        return new \Illuminate\Support\HtmlString("
                            <div class='flex flex-wrap items-center gap-3 text-xs mt-1'>
                                <span class='text-gray-500'>Masuk: <strong class='text-green-600'>Rp " . number_format($income, 0, ',', '.') . "</strong></span>
                                <span class='text-gray-500'>Keluar: <strong class='text-red-600'>Rp " . number_format(abs($expense), 0, ',', '.') . "</strong></span>
                                <span class='px-2 py-0.5 rounded bg-gray-50 border border-gray-200 font-bold'>
                                    NETT: <span style='color: {$netColorHex};'>{$netSign}Rp " . number_format(abs($net), 0, ',', '.') . "</span>
                                </span>
                            </div>
                        ");
                    })
            ])
            ->groupingSettingsHidden()
            ->heading(fn (\Filament\Tables\Contracts\HasTable $livewire) => new \Illuminate\Support\HtmlString(view('cashflow-tabs', ['livewire' => $livewire])->render()))
            ->filters([
                Tables\Filters\Filter::make('transaction_date')
                    ->form([
                        Forms\Components\Select::make('preset')
                            ->options([
                                'today' => 'Hari Ini',
                                'this_week' => 'Minggu Ini',
                                'this_month' => 'Bulan Ini',
                                'last_month' => 'Bulan Lalu',
                                'custom' => 'Kustom (Pilih Tanggal)',
                            ])
                            ->label('Rentang Waktu')
                            ->live(), // Ensures visibility toggling works instantly
                        Forms\Components\DatePicker::make('created_from')
                            ->label('Dari Tanggal')
                            ->visible(fn (\Filament\Forms\Get $get) => $get('preset') === 'custom'),
                        Forms\Components\DatePicker::make('created_until')
                            ->label('Sampai Tanggal')
                            ->visible(fn (\Filament\Forms\Get $get) => $get('preset') === 'custom'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        if (!empty($data['preset']) && $data['preset'] !== 'custom') {
                            $now = now();
                            match ($data['preset']) {
                                'today' => $query->whereDate('transaction_date', clone $now),
                                'this_week' => $query->whereBetween('transaction_date', [(clone $now)->startOfWeek(), (clone $now)->endOfWeek()]),
                                'this_month' => $query->whereMonth('transaction_date', $now->month)->whereYear('transaction_date', $now->year),
                                'last_month' => $query->whereMonth('transaction_date', (clone $now)->subMonth()->month)->whereYear('transaction_date', (clone $now)->subMonth()->year),
                                default => null,
                            };
                            return $query;
                        }

                        return $query
                            ->when(
                                $data['created_from'] ?? null,
                                fn (Builder $query, $date): Builder => $query->whereDate('transaction_date', '>=', $date),
                            )
                            ->when(
                                $data['created_until'] ?? null,
                                fn (Builder $query, $date): Builder => $query->whereDate('transaction_date', '<=', $date),
                            );
                    }),
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'income' => 'Pemasukan (+)',
                        'expense' => 'Pengeluaran (-)',
                    ])->label('Arus Kas'),
                Tables\Filters\SelectFilter::make('category')
                    ->options([
                        'F&B' => 'F&B',
                        'ATK' => 'ATK',
                        'Printing' => 'Printing',
                        'Digital' => 'Digital',
                        'Tabungan BEP' => 'Tabungan BEP',
                    ])
                    ->label('Kategori Usaha'),
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

    public static function getWidgets(): array
    {
        return [
            CashflowResource\Widgets\CashflowStats::class,
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ])
            ->orderBy('created_at', 'desc');
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
            'index' => Pages\ListCashflows::route('/'),
            'create' => Pages\CreateCashflow::route('/create'),
            'edit' => Pages\EditCashflow::route('/{record}/edit'),
        ];
    }
}
