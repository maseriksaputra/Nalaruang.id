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
                Tables\Columns\Layout\Split::make([
                    Tables\Columns\Layout\Stack::make([
                        Tables\Columns\TextColumn::make('description')
                            ->weight('bold')
                            ->size('sm')
                            ->searchable(),
                        Tables\Columns\TextColumn::make('category')
                            ->getStateUsing(fn (\App\Models\Cashflow $record) => 'Kategori ' . ($record->category ?? '-') . ' • Kas ' . ($record->type === 'income' ? 'Masuk' : 'Keluar'))
                            ->color('gray')
                            ->size('xs'),
                    ])->space(1)->grow(),

                    Tables\Columns\TextColumn::make('amount')
                        ->formatStateUsing(fn ($state) => 'Rp ' . number_format(abs((float)$state), 0, ',', '.'))
                        ->color(fn (\App\Models\Cashflow $record): string => $record->type === 'income' ? 'success' : 'danger')
                        ->weight('bold')
                        ->size('sm')
                        ->alignRight()
                        ->grow(false),
                ])->from('md')->extraAttributes(['class' => 'items-center py-2']),
            ])
            ->defaultSort('transaction_date', 'desc')
            ->defaultGroup('transaction_date')
            ->groups([
                Tables\Grouping\Group::make('transaction_date')
                    ->label('')
                    ->collapsible(false)
                    ->getTitleFromRecordUsing(function (\App\Models\Cashflow $record) {
                        $date = \Carbon\Carbon::parse($record->transaction_date)->format('Y-m-d');
                        $displayDate = \Carbon\Carbon::parse($record->transaction_date)->translatedFormat('d F Y');
                        
                        $income = \Illuminate\Support\Facades\Cache::remember('cashflow_income_'.$date, 2, fn() => \App\Models\Cashflow::whereDate('transaction_date', $date)->where('type', 'income')->sum('amount') ?? 0);
                        $expense = \Illuminate\Support\Facades\Cache::remember('cashflow_expense_'.$date, 2, fn() => \App\Models\Cashflow::whereDate('transaction_date', $date)->where('type', 'expense')->sum('amount') ?? 0);
                        $net = $income - $expense;
                        
                        $netColorHex = $net >= 0 ? '#16a34a' : '#dc2626';
                        $netSign = $net < 0 ? '-' : '';
                        
                        return new \Illuminate\Support\HtmlString("
                            <div class='flex flex-col md:flex-row md:items-center justify-between w-full pr-2 md:pr-4 gap-2 py-1'>
                                <span style='font-weight: 600; color: #374151; font-size: 0.875rem;'>{$displayDate}</span>
                                <div class='flex flex-wrap items-center gap-2 md:gap-4' style='font-size: 0.75rem;'>
                                    <span style='color: #6b7280;'>Masuk: <strong style='color: #16a34a;'>Rp " . number_format($income, 0, ',', '.') . "</strong></span>
                                    <span style='color: #6b7280;'>Keluar: <strong style='color: #dc2626;'>Rp " . number_format($expense, 0, ',', '.') . "</strong></span>
                                    <span style='color: #374151; background-color: #f3f4f6; padding: 0.25rem 0.6rem; border-radius: 9999px; font-weight: 600; border: 1px solid #e5e7eb; display: inline-block;'>
                                        NETT: <strong style='color: {$netColorHex};'>{$netSign}Rp " . number_format(abs($net), 0, ',', '.') . "</strong>
                                    </span>
                                </div>
                            </div>
                        ");
                    })
            ])
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
                    ])
                    ->label('Kategori Usaha'),
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

    public static function getWidgets(): array
    {
        return [
            CashflowResource\Widgets\CashflowStats::class,
        ];
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
