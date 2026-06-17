<x-filament-panels::page>
    <div class="kasir-grid" x-data="{ tab: 'F&B', type: @entangle('transactionType') }">
        
        <!-- Left Column: Products & Entry -->
        <div class="lg:col-span-2 space-y-6">
            
            <!-- Categories -->
            <div class="flex overflow-x-auto pb-2 hide-scrollbar custom-categories-wrapper" style="gap: 12px; margin-bottom: 1rem;">
                @foreach($categories as $cat)
                    <button x-on:click="tab = '{{ $cat }}'" 
                            class="category-tab-btn"
                            x-bind:class="tab === '{{ $cat }}' ? 'active-tab' : 'inactive-tab'">
                        {{ $cat }}
                    </button>
                @endforeach
            </div>

            <!-- Type & Date -->
            <div class="bg-white p-4 rounded-xl border border-pink-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div class="flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
                    <button x-on:click="type = 'income'" 
                            class="flex-1 sm:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all shadow-sm"
                            x-bind:style="type === 'income' ? 'background-color: white; color: #16a34a;' : 'color: #6b7280; box-shadow: none;'">
                        + Pemasukan
                    </button>
                    <button x-on:click="type = 'expense'" 
                            class="flex-1 sm:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all shadow-sm"
                            x-bind:style="type === 'expense' ? 'background-color: white; color: #dc2626;' : 'color: #6b7280; box-shadow: none;'">
                        - Pengeluaran
                    </button>
                </div>
                <div class="w-full sm:w-auto">
                    <input type="date" wire:model="transactionDate" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm font-medium text-gray-700">
                </div>
            </div>

            <!-- Product Grid -->
            <div class="product-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-bottom: 1.5rem;">
                @forelse($this->products as $product)
                    <button x-show="tab === '{{ $product->category }}'"
                            wire:click="addToCart({{ $product->id }}, '{{ $product->name }}', {{ $product->default_price }}, '{{ $product->category }}')" 
                            style="background-color: white; border: 1px solid #fbcfe8; border-radius: 12px; padding: 12px; text-align: left; min-height: 90px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: transform 0.1s, background-color 0.2s;"
                            onmouseover="this.style.backgroundColor='#fdf2f8'" onmouseout="this.style.backgroundColor='white'" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1)'">
                        <span style="font-weight: 600; color: #1f2937; font-size: 14px; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ $product->name }}</span>
                        <span style="color: #db2777; font-weight: bold; font-size: 13px; margin-top: 8px;">Rp {{ number_format($product->default_price, 0, ',', '.') }}</span>
                    </button>
                @empty
                @endforelse
                
                <!-- Notice if no products exist overall -->
                @if(count($this->products) === 0)
                    <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: #9ca3af; font-size: 14px; font-style: italic; background-color: white; border-radius: 12px; border: 1px dashed #fbcfe8;">
                        Belum ada template produk.
                    </div>
                @endif
            </div>

            <!-- Manual Entry -->
            <div style="background-color: white; padding: 20px; border-radius: 12px; border: 1px solid #fbcfe8; box-shadow: 0 1px 3px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background-color: #f472b6;"></div>
                <h3 style="font-weight: bold; color: #1f2937; margin-bottom: 12px; font-size: 14px; margin-top: 0;">Ketikan Manual (Auto-Save Template)</h3>
                
                <div style="display: flex; flex-wrap: wrap; gap: 12px;">
                    <div style="flex: 1; min-width: 200px;">
                        <input type="text" wire:model.defer="manualName" placeholder="Nama Produk / Transaksi" 
                               style="width: 100%; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; padding: 10px; outline: none;"
                               onfocus="this.style.borderColor='#ec4899'; this.style.boxShadow='0 0 0 2px rgba(236,72,153,0.2)'"
                               onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'">
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <input type="number" wire:model.defer="manualPrice" placeholder="Harga Satuan" 
                               style="width: 100%; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; padding: 10px; outline: none;"
                               onfocus="this.style.borderColor='#ec4899'; this.style.boxShadow='0 0 0 2px rgba(236,72,153,0.2)'"
                               onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'">
                    </div>
                    <div style="display: flex; gap: 8px; min-width: 150px;">
                        <input type="number" wire:model.defer="manualQty" min="1" 
                               style="width: 60px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; padding: 10px; text-align: center; outline: none;"
                               onfocus="this.style.borderColor='#ec4899'; this.style.boxShadow='0 0 0 2px rgba(236,72,153,0.2)'"
                               onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'">
                        <button x-on:click="$wire.addManual(tab)" 
                                style="flex: 1; background-color: #db2777; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: bold; padding: 0 16px; cursor: pointer; box-shadow: 0 2px 4px rgba(219,39,119,0.3); transition: background-color 0.2s;"
                                onmouseover="this.style.backgroundColor='#be185d'" onmouseout="this.style.backgroundColor='#db2777'" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1)'">
                            + Tambah
                        </button>
                    </div>
                </div>
            </div>

        </div>

        <!-- Right Column: Cart -->
        <div class="lg:col-span-1">
            <div class="bg-white rounded-xl border border-pink-200 shadow-sm flex flex-col h-[calc(100vh-12rem)] max-h-[600px] sticky top-6">
                
                <!-- Cart Header -->
                <div class="p-4 border-b border-gray-100 bg-pink-50/50 rounded-t-xl flex justify-between items-center">
                    <h3 class="font-bold text-pink-800">Keranjang Kasir</h3>
                    <span class="bg-pink-200 text-pink-800 text-xs font-bold px-2 py-1 rounded-full">{{ count($cart) }} Item</span>
                </div>

                <!-- Cart Items -->
                <div class="flex-1 overflow-y-auto p-4 space-y-3">
                    @forelse($cart as $key => $item)
                        <div class="flex flex-col p-3 border border-pink-100 rounded-lg bg-white relative group">
                            <button wire:click="removeItem('{{ $key }}')" class="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                x
                            </button>
                            <div class="flex justify-between items-start mb-2">
                                <div class="pr-4">
                                    <h4 class="font-bold text-gray-800 text-sm leading-tight">{{ $item['name'] }}</h4>
                                    <span class="text-[10px] uppercase text-pink-500 font-bold tracking-wider">{{ $item['category'] }}</span>
                                </div>
                            </div>
                            
                            <div class="flex items-center justify-between mt-auto">
                                <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 h-8">
                                    <button wire:click="updateQty('{{ $key }}', -1)" class="w-8 h-full flex items-center justify-center hover:bg-gray-200 text-gray-600 font-bold transition-colors">-</button>
                                    <span class="w-8 text-center text-sm font-bold">{{ $item['qty'] }}</span>
                                    <button wire:click="updateQty('{{ $key }}', 1)" class="w-8 h-full flex items-center justify-center hover:bg-gray-200 text-gray-600 font-bold transition-colors">+</button>
                                </div>
                                <div class="text-right">
                                    <div class="text-xs text-gray-400">{{ number_format($item['price'], 0, ',', '.') }} / item</div>
                                    <div class="font-bold text-gray-900 text-sm">Rp {{ number_format($item['price'] * $item['qty'], 0, ',', '.') }}</div>
                                </div>
                            </div>
                        </div>
                    @empty
                        <div class="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                            <svg width="48" height="48" style="width: 3rem; height: 3rem;" class="mb-3 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <p class="text-sm">Belum ada item di keranjang.</p>
                        </div>
                    @endforelse
                </div>

                <!-- Cart Footer -->
                <div class="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                    <div class="flex justify-between items-end mb-4">
                        <span class="text-sm font-medium text-gray-500">Total Transaksi</span>
                        <span class="text-2xl font-black text-pink-600">Rp {{ number_format($this->cartTotal, 0, ',', '.') }}</span>
                    </div>
                    
                    <button wire:click="processTransaction" 
                            class="w-full py-3 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            x-bind:style="(type === 'income' ? 'background-color: #16a34a;' : 'background-color: #dc2626;') + ' ' + ({{ empty($cart) ? '1' : '0' }} ? 'opacity: 0.5; cursor: not-allowed;' : '')"
                            @if(empty($cart)) disabled @endif>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                        Simpan Transaksi
                    </button>
                </div>
            </div>
        </div>

    </div>

    <style>
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        
        .category-tab-btn {
            padding: 10px 20px;
            border-radius: 99px;
            font-weight: bold;
            font-size: 14px;
            white-space: nowrap;
            border: 1px solid;
            transition: all 0.2s;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            cursor: pointer;
        }
        
        .inactive-tab {
            border-color: #e5e7eb;
            background-color: #ffffff;
            color: #4b5563;
        }
        
        .inactive-tab:hover {
            border-color: #f9a8d4;
            background-color: #fdf2f8;
        }
        
        .active-tab {
            border-color: #fbcfe8;
            background-color: #fdf2f8;
            color: #be185d;
        }
        
        /* Make sure the grid works properly on mobile */
        @media (min-width: 1024px) {
            .kasir-grid {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 24px;
            }
        }
        @media (max-width: 1023px) {
            .kasir-grid {
                display: flex;
                flex-direction: column;
                gap: 24px;
            }
        }
    </style>
</x-filament-panels::page>
