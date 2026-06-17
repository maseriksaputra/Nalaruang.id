<?php

namespace App\Filament\Resources\CashflowResource\Pages;

use App\Filament\Resources\CashflowResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCashflows extends ListRecords
{
    protected static string $resource = CashflowResource::class;



    protected function getHeaderWidgets(): array
    {
        return [
            CashflowResource\Widgets\CashflowStats::class,
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\Action::make('bulk_input')
                ->label('Input Massal via Teks')
                ->icon('heroicon-o-document-text')
                ->color('primary')
                ->form([
                    \Filament\Forms\Components\DatePicker::make('transaction_date')
                        ->label('Tanggal Transaksi')
                        ->default(now())
                        ->required(),
                    \Filament\Forms\Components\Textarea::make('bulk_text')
                        ->label('Teks Transaksi (Copy-Paste)')
                        ->helperText(new \Illuminate\Support\HtmlString('Format per baris: <code>[+/-] [KODE_KATEGORI] [Nama Barang] [Qty] [Harga]</code><br>Kode: FNB, ATK, PRN (Printing), DGT (Digital)'))
                        ->placeholder("+ FNB Es Kopi Susu Aren 2 15000\n- ATK Kertas HVS A4 1 50000\n+ PRN Cetak Undangan 100 2500")
                        ->rows(10)
                        ->required(),
                ])
                ->action(function (array $data) {
                    $text = $data['bulk_text'];
                    $date = $data['transaction_date'];
                    
                    $lines = explode("\n", str_replace("\r", "", $text));
                    
                    $successCount = 0;
                    $failedLines = [];
                    
                    \Illuminate\Support\Facades\DB::beginTransaction();
                    
                    try {
                        foreach ($lines as $index => $line) {
                            $line = trim($line);
                            if (empty($line)) continue;
                            
                            $parts = preg_split('/\s+/', $line);
                            
                            if (count($parts) < 5) {
                                $failedLines[] = "Baris " . ($index + 1) . " (Kurang data)";
                                continue;
                            }
                            
                            $typeRaw = array_shift($parts);
                            $catRaw = array_shift($parts);
                            $priceRaw = array_pop($parts);
                            $qtyRaw = array_pop($parts);
                            
                            $description = implode(' ', $parts);
                            
                            $type = match($typeRaw) {
                                '+' => 'income',
                                '-' => 'expense',
                                default => null,
                            };
                            
                            $catRawUpper = strtoupper($catRaw);
                            $category = match($catRawUpper) {
                                'FNB' => 'F&B',
                                'ATK' => 'ATK',
                                'PRN' => 'Printing',
                                'DGT' => 'Digital',
                                default => null,
                            };
                            
                            $price = (float) preg_replace('/[^0-9.]/', '', $priceRaw);
                            $qty = (int) preg_replace('/[^0-9]/', '', $qtyRaw);
                            
                            if (!$type || !$category || $price <= 0 || $qty <= 0 || empty($description)) {
                                $failedLines[] = "Baris " . ($index + 1) . " (Format tipe/kategori/angka tidak valid)";
                                continue;
                            }
                            
                            $amount = $qty * $price;
                            
                            \App\Models\Cashflow::create([
                                'type' => $type,
                                'category' => $category,
                                'description' => $description,
                                'quantity' => $qty,
                                'price' => $price,
                                'amount' => $amount,
                                'transaction_date' => $date,
                            ]);
                            
                            $successCount++;
                        }
                        
                        \Illuminate\Support\Facades\DB::commit();
                        
                        if (count($failedLines) > 0) {
                            \Filament\Notifications\Notification::make()
                                ->title('Sebagian Berhasil')
                                ->body("$successCount berhasil ditambahkan. " . count($failedLines) . " gagal diproses:\n" . implode("\n", $failedLines))
                                ->warning()
                                ->send();
                        } else {
                            \Filament\Notifications\Notification::make()
                                ->title('Sukses')
                                ->body("$successCount transaksi berhasil ditambahkan ke Buku Kas.")
                                ->success()
                                ->send();
                        }
                        
                    } catch (\Exception $e) {
                        \Illuminate\Support\Facades\DB::rollBack();
                        \Filament\Notifications\Notification::make()
                            ->title('Gagal Memproses')
                            ->body('Terjadi kesalahan: ' . $e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),
            \Filament\Actions\CreateAction::make(),
        ];
    }
}
