<?php

namespace App\Filament\Widgets;

use App\Models\Cashflow;
use App\Models\Setting;
use Carbon\Carbon;
use Filament\Actions\Action;
use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Widgets\Widget;
use Filament\Support\Enums\ActionSize;

use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;

class BepOverviewWidget extends Widget implements HasActions, HasForms
{
    use InteractsWithActions;
    use InteractsWithForms;

    protected static string $view = 'filament.widgets.bep-overview-widget';
    protected int | string | array $columnSpan = 'full';
    protected static ?int $sort = 2;

    public function mount(): void
    {
        $this->syncAutoBepOutflows();
    }

    protected function syncAutoBepOutflows(): void
    {
        if (\Illuminate\Support\Facades\Cache::has('last_bep_sync_time')) {
            return;
        }

        if (!\Illuminate\Support\Facades\Schema::hasTable('settings')) return;

        $dailyTarget = Setting::get('bep_daily_target', 30000);
        $firstCashflow = Cashflow::orderBy('transaction_date', 'asc')->first();
        $defaultStartDate = $firstCashflow ? Carbon::parse($firstCashflow->transaction_date)->format('Y-m-d') : now()->format('Y-m-d');
        $startDateStr = Setting::get('bep_start_date', $defaultStartDate);

        $dailyMargins = \Illuminate\Support\Facades\DB::table('cashflows')
            ->selectRaw('DATE(transaction_date) as date, SUM(amount) as net')
            ->where(function($q) {
                $q->where('category', '!=', 'Tabungan BEP')
                  ->orWhereNull('category');
            })
            ->where('transaction_date', '>=', $startDateStr)
            ->groupByRaw('DATE(transaction_date)')
            ->pluck('net', 'date');

        $existingAutoBeps = \Illuminate\Support\Facades\DB::table('cashflows')
            ->where('reference_type', 'AUTO_BEP')
            ->where('transaction_date', '>=', $startDateStr)
            ->get()
            ->keyBy(function($item) {
                return Carbon::parse($item->transaction_date)->format('Y-m-d');
            });

        $inserts = [];
        $updates = [];
        $deletes = [];

        $startDate = Carbon::parse($startDateStr)->startOfDay();
        $daysPassed = $startDate->diffInDays(now()->startOfDay()) + 1;

        for ($i = 0; $i < $daysPassed; $i++) {
            $date = $startDate->copy()->addDays($i)->format('Y-m-d');
            $netMargin = $dailyMargins->get($date) ?? 0;
            $autoBepTarget = $netMargin > 0 ? min($netMargin, $dailyTarget) : 0;
            $existing = $existingAutoBeps->get($date);

            if ($autoBepTarget > 0) {
                if ($existing) {
                    if ($existing->amount != -$autoBepTarget) {
                        $updates[] = ['id' => $existing->id, 'amount' => -$autoBepTarget];
                    }
                } else {
                    $inserts[] = [
                        'type' => 'expense',
                        'amount' => -$autoBepTarget,
                        'description' => 'Potongan Otomatis BEP Harian',
                        'category' => 'Tabungan BEP',
                        'transaction_date' => $date,
                        'reference_type' => 'AUTO_BEP',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            } else {
                if ($existing) {
                    $deletes[] = $existing->id;
                }
            }
        }

        if (!empty($inserts)) \Illuminate\Support\Facades\DB::table('cashflows')->insert($inserts);
        if (!empty($deletes)) \Illuminate\Support\Facades\DB::table('cashflows')->whereIn('id', $deletes)->delete();
        foreach ($updates as $update) {
            \Illuminate\Support\Facades\DB::table('cashflows')->where('id', $update['id'])->update(['amount' => $update['amount'], 'updated_at' => now()]);
        }
        
        \Illuminate\Support\Facades\Cache::put('last_bep_sync_time', true, now()->addMinutes(60));
    }

    public function getViewData(): array
    {
        $totalTarget = Setting::get('bep_total_target', 10000000);
        $dailyTarget = Setting::get('bep_daily_target', 30000);
        $firstCashflow = Cashflow::orderBy('transaction_date', 'asc')->first();
        $defaultStartDate = $firstCashflow ? Carbon::parse($firstCashflow->transaction_date)->format('Y-m-d') : now()->format('Y-m-d');
        $startDateStr = Setting::get('bep_start_date', $defaultStartDate);
        $startDate = Carbon::parse($startDateStr)->startOfDay();

        $daysPassed = $startDate->diffInDays(now()->startOfDay()) + 1;
        $totalExpected = $daysPassed * $dailyTarget;
        
        $autoCollected = abs(Cashflow::where('reference_type', 'AUTO_BEP')->sum('amount'));
        $manualCollected = abs(Cashflow::where('category', 'Tabungan BEP')->where('type', 'expense')->where('reference_type', '!=', 'AUTO_BEP')->sum('amount'));

        $totalCollected = $autoCollected + $manualCollected;
        
        // Ganti Tunggakan Harian menjadi Sisa Keseluruhan
        $sisaTarget = max(0, $totalTarget - $totalCollected);
        
        $totalIncome = Cashflow::where('type', 'income')->sum('amount');
        $totalExpense = Cashflow::where('type', 'expense')->sum('amount');
        
        // Gunakan logic plus karena database menset expense jadi negatif
        $availableCash = $totalIncome + $totalExpense;

        $progress = $totalTarget > 0 ? min(100, ($totalCollected / $totalTarget) * 100) : 0;

        return [
            'totalTarget' => $totalTarget,
            'totalCollected' => $totalCollected,
            'sisaTarget' => $sisaTarget,
            'availableCash' => $availableCash,
            'progress' => $progress,
            'daysPassed' => $daysPassed,
            'dailyTarget' => $dailyTarget,
            'autoCollected' => $autoCollected,
            'manualCollected' => $manualCollected,
        ];
    }

    public function depositAction(): Action
    {
        return Action::make('deposit')
            ->label('Setor Kas ke BEP')
            ->color('primary')
            ->size(ActionSize::Large)
            ->icon('heroicon-m-banknotes')
            ->form([
                TextInput::make('amount')
                    ->label('Nominal Setoran')
                    ->numeric()
                    ->required()
                    ->prefix('Rp')
                    ->default(function () {
                        $dailyTarget = Setting::get('bep_daily_target', 30000);
                        $firstCashflow = Cashflow::orderBy('transaction_date', 'asc')->first();
                        $defaultStartDate = $firstCashflow ? Carbon::parse($firstCashflow->transaction_date)->format('Y-m-d') : now()->format('Y-m-d');
                        $startDateStr = Setting::get('bep_start_date', $defaultStartDate);
                        $startDate = Carbon::parse($startDateStr)->startOfDay();
                
                        $daysPassed = $startDate->diffInDays(now()->startOfDay()) + 1;
                        $totalExpected = $daysPassed * $dailyTarget;
                        
                        $autoCollected = abs(Cashflow::where('reference_type', 'AUTO_BEP')->sum('amount'));
                        $manualCollected = abs(Cashflow::where('category', 'Tabungan BEP')->where('type', 'expense')->where('reference_type', '!=', 'AUTO_BEP')->sum('amount'));
                        return max(0, $totalExpected - ($autoCollected + $manualCollected));
                    })
                    ->rule(function (\Filament\Forms\Get $get) {
                        return function (string $attribute, $value, \Closure $fail) use ($get) {
                            if ($get('source') === 'Laci Kasir') {
                                $totalIncome = Cashflow::where('type', 'income')->sum('amount');
                                $totalExpense = Cashflow::where('type', 'expense')->sum('amount');
                                $availableCash = max(0, $totalIncome + $totalExpense);
                                
                                if ($value > $availableCash) {
                                    $fail('Nominal tidak boleh melebihi Sisa Kas Tersedia (Rp ' . number_format($availableCash, 0, ',', '.') . ').');
                                }
                            }
                        };
                    }),
                \Filament\Forms\Components\ToggleButtons::make('source')
                    ->label('Sumber Dana')
                    ->options([
                        'Laci Kasir' => 'Laci Kasir (Memotong Kas Tersedia)',
                        'Dana Pribadi' => 'Dana Pribadi / Simpanan (Tidak Memotong Kas)',
                    ])
                    ->colors([
                        'Laci Kasir' => 'warning',
                        'Dana Pribadi' => 'info',
                    ])
                    ->inline()
                    ->default('Laci Kasir')
                    ->required(),
                TextInput::make('note')
                    ->label('Catatan Tambahan')
                    ->placeholder('Misal: Transfer ke BCA'),
            ])
            ->action(function (array $data): void {
                $description = 'Setor ke Tabungan BEP (' . $data['source'] . ')';
                if (!empty($data['note'])) {
                    $description .= ' - ' . $data['note'];
                }

                if ($data['source'] === 'Dana Pribadi') {
                    Cashflow::create([
                        'type' => 'income',
                        'amount' => $data['amount'],
                        'description' => 'Suntikan Dana Pribadi untuk BEP',
                        'category' => 'Tabungan BEP',
                        'transaction_date' => now(),
                        'reference_type' => 'BEP_INJECT',
                    ]);
                }

                Cashflow::create([
                    'type' => 'expense',
                    'amount' => $data['amount'],
                    'description' => $description,
                    'category' => 'Tabungan BEP',
                    'transaction_date' => now(),
                    'reference_type' => 'BEP',
                ]);
                
                Notification::make()
                    ->title('Berhasil disetor!')
                    ->success()
                    ->send();
            });
    }
}
