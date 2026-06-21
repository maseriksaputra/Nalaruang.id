<?php

namespace App\Filament\Pages;

use App\Models\CashierProduct;
use App\Models\Cashflow;
use Filament\Pages\Page;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\DB;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;

class Kasir extends Page implements HasTable
{
    use InteractsWithTable;
    protected static ?string $navigationIcon = 'heroicon-o-calculator';
    protected static ?string $navigationGroup = 'Transaksi & Keuangan';
    protected static ?string $title = 'Mesin Kasir';
    protected static ?int $navigationSort = 0; // At the top of Buku Kas
    protected static string $view = 'filament.pages.kasir';

    public string $transactionType = 'income';
    public string $transactionDate;
    
    public array $cart = [];
    public array $categories = ['F&B', 'ATK', 'Printing', 'Digital'];

    public string $manualName = '';
    public $manualPrice = '';
    public int $manualQty = 1;

    public bool $isBulkMode = false;
    public string $bulkText = '';

    public function mount()
    {
        $this->transactionDate = now()->format('Y-m-d');
    }

    public function getProductsProperty()
    {
        // Load all products so Alpine.js can filter them instantly on the frontend
        return CashierProduct::all()->sortBy('name', SORT_NATURAL | SORT_FLAG_CASE)->values();
    }

    public function addToCart($productId, $name, $price, $category)
    {
        // Cari apakah produk dengan nama, harga, dan tipe yang sama sudah ada di keranjang
        foreach ($this->cart as $cartId => $item) {
            if ($item['product_id'] == $productId && $item['price'] == $price && $item['type'] === $this->transactionType) {
                $this->cart[$cartId]['qty'] += 1;
                return;
            }
        }

        $cartId = uniqid();
        $newItem = [
            'id' => $cartId,
            'product_id' => $productId,
            'name' => $name,
            'price' => (float) $price,
            'qty' => 1,
            'category' => $category,
            'type' => $this->transactionType,
        ];
        $this->cart = [$cartId => $newItem] + $this->cart;
    }

    public function addManual($category)
    {
        if (empty($this->manualName) || $this->manualPrice === '') {
            Notification::make()
                ->warning()
                ->title('Lengkapi Data')
                ->body('Nama produk dan harga harus diisi.')
                ->send();
            return;
        }

        $price = (float) $this->manualPrice;

        // Auto save as template
        $product = CashierProduct::firstOrCreate([
            'name' => $this->manualName, 
            'category' => $category,
            'default_price' => $price
        ]);

        // Cari apakah produk manual ini sudah ada di keranjang
        foreach ($this->cart as $cartId => $item) {
            if ($item['product_id'] == $product->id && $item['price'] == $price && $item['type'] === $this->transactionType) {
                $this->cart[$cartId]['qty'] += $this->manualQty;
                $this->manualName = '';
                $this->manualPrice = '';
                $this->manualQty = 1;
                
                Notification::make()
                    ->success()
                    ->title('Berhasil')
                    ->body('Kuantitas produk ditambahkan di keranjang.')
                    ->send();
                return;
            }
        }

        $cartId = uniqid();
        $newItem = [
            'id' => $cartId,
            'product_id' => $product->id,
            'name' => $this->manualName,
            'price' => $price,
            'qty' => $this->manualQty,
            'category' => $category,
            'type' => $this->transactionType,
        ];
        $this->cart = [$cartId => $newItem] + $this->cart;

        $this->manualName = '';
        $this->manualPrice = '';
        $this->manualQty = 1;

        Notification::make()
            ->success()
            ->title('Berhasil')
            ->body('Produk ditambahkan ke keranjang.')
            ->send();
    }

    public function updateQty($cartId, $amount)
    {
        if (isset($this->cart[$cartId])) {
            $this->cart[$cartId]['qty'] += $amount;
            if ($this->cart[$cartId]['qty'] <= 0) {
                unset($this->cart[$cartId]);
            }
        }
    }

    public function removeItem($cartId)
    {
        if (isset($this->cart[$cartId])) {
            unset($this->cart[$cartId]);
        }
    }

    public function updatePrice($cartId, $price)
    {
        if (isset($this->cart[$cartId])) {
            $this->cart[$cartId]['price'] = (float) $price;
        }
    }

    public function getCartTotalProperty()
    {
        return collect($this->cart)->sum(function ($item) {
            $type = $item['type'] ?? $this->transactionType;
            $amount = $item['price'] * $item['qty'];
            return $type === 'expense' ? -$amount : $amount;
        });
    }

    public function processBulk()
    {
        if (empty(trim($this->bulkText))) {
            Notification::make()->warning()->title('Teks Kosong')->body('Silakan paste hasil dari AI terlebih dahulu.')->send();
            return;
        }

        $lines = explode("\n", str_replace("\r", "", $this->bulkText));
        $successCount = 0;
        $failedLines = [];

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

            // Generate product if not exists to save as template
            $product = CashierProduct::firstOrCreate([
                'name' => $description, 
                'category' => $category,
                'default_price' => $price
            ]);

            $cartId = uniqid();
            $newItem = [
                'id' => $cartId,
                'product_id' => $product->id,
                'name' => $description,
                'price' => $price,
                'qty' => $qty,
                'category' => $category,
                'type' => $type,
            ];
            $this->cart = [$cartId => $newItem] + $this->cart;

            $successCount++;
        }

        $this->bulkText = '';

        if (count($failedLines) > 0) {
            Notification::make()
                ->warning()
                ->title('Sebagian Berhasil')
                ->body("$successCount dimasukkan ke keranjang. " . count($failedLines) . " gagal diproses:\n" . implode("\n", $failedLines))
                ->send();
        } else {
            Notification::make()
                ->success()
                ->title('Berhasil')
                ->body("$successCount transaksi dimasukkan ke keranjang.")
                ->send();
        }
    }

    public function processTransaction()
    {
        if (empty($this->cart)) {
            Notification::make()
                ->warning()
                ->title('Keranjang Kosong')
                ->body('Pilih atau ketik produk terlebih dahulu.')
                ->send();
            return;
        }

        DB::beginTransaction();
        try {
            foreach ($this->cart as $item) {
                Cashflow::create([
                    'type' => $item['type'] ?? $this->transactionType,
                    'amount' => $item['price'] * $item['qty'],
                    'description' => $item['name'],
                    'transaction_date' => $this->transactionDate,
                    'reference_type' => 'Kasir',
                    'quantity' => $item['qty'],
                    'price' => $item['price'],
                    'category' => $item['category'],
                ]);
            }
            DB::commit();

            $this->cart = [];
            
            Notification::make()
                ->success()
                ->title('Transaksi Tersimpan')
                ->body('Semua data berhasil masuk ke Buku Kas.')
                ->send();
                
            $this->dispatch('transaction-saved');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Notification::make()
                ->danger()
                ->title('Terjadi Kesalahan')
                ->body($e->getMessage())
                ->send();
        }
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(Cashflow::query()->where('reference_type', 'Kasir')->latest('id'))
            ->columns([
                TextColumn::make('transaction_date')
                    ->label('Tanggal')
                    ->date('d M Y')
                    ->sortable(),
                TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'F&B' => 'warning',
                        'ATK' => 'gray',
                        'Printing' => 'info',
                        'Digital' => 'success',
                        default => 'primary',
                    }),
                TextColumn::make('description')
                    ->label('Keterangan')
                    ->searchable(),
                TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'income' => 'success',
                        'expense' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'income' => 'Pemasukan',
                        'expense' => 'Pengeluaran',
                        default => $state,
                    }),
                TextColumn::make('amount')
                    ->label('Total')
                    ->money('IDR')
                    ->sortable()
                    ->color(fn ($record) => $record->type === 'income' ? 'success' : 'danger'),
            ])
            ->actions([
                DeleteAction::make()
                    ->successNotificationTitle('Transaksi dihapus'),
            ])
            ->paginated([5, 10, 25])
            ->defaultPaginationPageOption(5);
    }
}
