<?php

namespace App\Filament\Pages;

use App\Models\CashierProduct;
use App\Models\Cashflow;
use Filament\Pages\Page;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\DB;

class Kasir extends Page
{
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

    public function mount()
    {
        $this->transactionDate = now()->format('Y-m-d');
    }

    public function getProductsProperty()
    {
        // Load all products so Alpine.js can filter them instantly on the frontend
        return CashierProduct::all();
    }

    public function addToCart($productId, $name, $price, $category)
    {
        $cartId = uniqid();
        $this->cart[$cartId] = [
            'id' => $cartId,
            'product_id' => $productId,
            'name' => $name,
            'price' => (float) $price,
            'qty' => 1,
            'category' => $category,
        ];
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
        $product = CashierProduct::firstOrCreate(
            ['name' => $this->manualName, 'category' => $category],
            ['default_price' => $price]
        );

        $cartId = uniqid();
        $this->cart[$cartId] = [
            'id' => $cartId,
            'product_id' => $product->id,
            'name' => $this->manualName,
            'price' => $price,
            'qty' => $this->manualQty,
            'category' => $category,
        ];

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
            return $item['price'] * $item['qty'];
        });
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
                    'type' => $this->transactionType,
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
                
        } catch (\Exception $e) {
            DB::rollBack();
            Notification::make()
                ->danger()
                ->title('Terjadi Kesalahan')
                ->body($e->getMessage())
                ->send();
        }
    }
}
