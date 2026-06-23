@extends('layouts.main')

@section('content')
<style>
    .prose img { max-width: 100%; border-radius: 0.5rem; }
    .prose p { margin-bottom: 0.75rem; color: #475569; line-height: 1.6; }
    .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; color: #475569; }
    .prose ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; color: #475569; }
    .prose h2, .prose h3 { font-weight: 700; color: #1e293b; margin-top: 1.5rem; margin-bottom: 0.75rem; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
    <main class="max-w-7xl mx-auto px-0 md:px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        
        <div class="bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-100 overflow-hidden">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-0 md:gap-8">
                
                <!-- Left Column: Image Slider -->
                <div class="lg:col-span-5 md:p-6" 
                     x-data="{ 
                        currentSlide: 0, 
                        slides: {{ Js::from($product->images ? array_filter(array_merge([$product->image], $product->images)) : ($product->image ? [$product->image] : [])) }},
                        init() {
                            if(this.slides.length === 0) {
                                this.slides = ['https://placehold.co/800x800/e2e8f0/64748b?text=No+Image'];
                            }
                            if (this.slides.length > 1) {
                                setInterval(() => { 
                                    this.currentSlide = this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
                                }, 3000);
                            }
                        }
                     }">
                    
                    <!-- Main Slider -->
                    <div class="relative w-full aspect-square md:rounded-xl overflow-hidden bg-gray-100 group">
                        <div class="absolute inset-0 w-full h-full flex transition-transform duration-500 ease-out"
                             x-bind:style="'transform: translateX(-' + (currentSlide * 100) + '%)'">
                            <template x-for="(slide, index) in slides" :key="index">
                                <img x-bind:src="slide.startsWith('http') ? slide : '{{ rtrim(str_replace('test.txt', '', Storage::url('test.txt')), '/') }}/' + slide" 
                                     x-bind:alt="'{{ $product->name }} - Gambar ' + (index+1)" 
                                     class="w-full h-full object-cover shrink-0 cursor-zoom-in hover:scale-105 transition-transform duration-500">
                            </template>
                        </div>
                        
                        <!-- Arrows (only show if multiple slides) -->
                        <div x-show="slides.length > 1" class="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button @click="currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1" class="w-10 h-10 rounded-full bg-white/80 backdrop-blur hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition-all transform hover:scale-110">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                            </button>
                            <button @click="currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1" class="w-10 h-10 rounded-full bg-white/80 backdrop-blur hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition-all transform hover:scale-110">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        </div>
                    </div>

                    <!-- Thumbnails -->
                    <div x-show="slides.length > 1" class="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2 px-4 md:px-0">
                        <template x-for="(slide, index) in slides" :key="index">
                            <button @click="currentSlide = index" 
                                    class="relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all"
                                    x-bind:class="currentSlide === index ? 'border-[#d81b60] shadow-md' : 'border-transparent opacity-60 hover:opacity-100'">
                                <img x-bind:src="slide.startsWith('http') ? slide : '{{ rtrim(str_replace('test.txt', '', Storage::url('test.txt')), '/') }}/' + slide" 
                                     class="w-full h-full object-cover">
                            </button>
                        </template>
                    </div>
                </div>

                <!-- Right Column: Product Info -->
                <div class="lg:col-span-7 p-4 md:p-6 md:pl-0 flex flex-col">
                    
                    <!-- Badges -->
                    <div class="flex items-center gap-2 mb-3">
                        @if($product->serviceCategory)
                            <span class="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-md">{{ $product->serviceCategory->name }}</span>
                        @elseif($product->category)
                            <span class="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-md">{{ $product->category }}</span>
                        @endif
                        
                        @if(($product->stok ?? 0) > 0)
                            <span class="bg-green-50 text-green-600 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                                Stok Tersedia
                            </span>
                        @else
                            <span class="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-md">Stok Habis</span>
                        @endif
                    </div>

                    <!-- Title -->
                    <h2 class="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-3">{{ $product->name }}</h2>
                    
                    <!-- Stats -->
                    <div class="flex items-center text-sm text-gray-500 gap-4 mb-4 pb-4 border-b border-gray-100">
                        <div class="flex items-center gap-1.5">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <span><strong class="text-gray-900">{{ $product->orders_count ?? 0 }}</strong> Terjual</span>
                        </div>
                        <div class="flex items-center gap-1.5" id="share-stat-container">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                            <span><strong class="text-gray-900" id="share-count">{{ $product->shares ?? 0 }}</strong> Dibagikan</span>
                        </div>
                    </div>

                    <!-- Price -->
                    <div class="flex flex-col mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        @if($product->discount_price && $product->discount_price < $product->price)
                            <div class="flex items-center gap-2 mb-1">
                                <span class="bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded">
                                    Diskon {{ round((($product->price - $product->discount_price) / $product->price) * 100) }}%
                                </span>
                                <span class="text-sm text-gray-400 line-through">Rp {{ number_format($product->price, 0, ',', '.') }}</span>
                            </div>
                            <span class="text-4xl font-black text-[#d81b60]">Rp {{ number_format($product->discount_price, 0, ',', '.') }}</span>
                        @else
                            <span class="text-sm text-gray-500 mb-1">Harga Utama</span>
                            <span class="text-4xl font-black text-[#d81b60]">Rp {{ number_format($product->price, 0, ',', '.') }}</span>
                        @endif
                    </div>

                    <!-- Desktop Actions -->
                    <div class="hidden md:flex gap-4 mb-8">
                        @if($product->preview_url)
                        <a href="{{ $product->preview_url }}" target="_blank" class="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            Live Preview
                        </a>
                        @endif
                        <button type="button" onclick="shareProduct()" class="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                            Bagikan
                        </button>
                        <a href="{{ route('order.create', $product->id) }}" class="flex-1 flex items-center justify-center bg-[#d81b60] hover:bg-[#b0164e] text-white font-bold rounded-xl px-8 py-3.5 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-pink-500/30 text-lg">
                            Beli Sekarang
                        </a>
                    </div>

                    <!-- Specs and Details Tabs -->
                    <div x-data="{ tab: 'detail' }" class="mt-4 md:mt-0 border border-gray-200 rounded-xl overflow-hidden bg-white">
                        <div class="flex border-b border-gray-200 bg-gray-50/50">
                            <button @click="tab = 'detail'" class="flex-1 py-3.5 text-sm font-bold transition-colors" :class="tab === 'detail' ? 'text-[#d81b60] border-b-2 border-[#d81b60] bg-white' : 'text-gray-500 hover:text-gray-700'">Deskripsi</button>
                            <button @click="tab = 'spesifikasi'" class="flex-1 py-3.5 text-sm font-bold transition-colors" :class="tab === 'spesifikasi' ? 'text-[#d81b60] border-b-2 border-[#d81b60] bg-white' : 'text-gray-500 hover:text-gray-700'">Spesifikasi</button>
                        </div>
                        
                        <div class="p-5 md:p-6 min-h-[300px]">
                            <!-- Deskripsi -->
                            <div x-show="tab === 'detail'" class="prose prose-sm md:prose-base max-w-none text-gray-600" x-transition.opacity>
                                @if($product->description)
                                    {!! $product->description !!}
                                @else
                                    <div class="flex flex-col items-center justify-center py-10 text-gray-400">
                                        <svg class="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                        <p class="italic">Belum ada deskripsi untuk produk ini.</p>
                                    </div>
                                @endif
                            </div>

                            <!-- Spesifikasi -->
                            <div x-show="tab === 'spesifikasi'" style="display: none;" class="animate-fade-in" x-transition.opacity>
                                @if(!empty($product->specifications) && is_array($product->specifications))
                                    <table class="w-full text-sm text-left border-collapse">
                                        <tbody>
                                            @foreach($product->specifications as $key => $value)
                                            <tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                                <th class="py-3 pr-4 font-semibold text-gray-500 w-1/3 md:w-1/4 align-top">{{ $key }}</th>
                                                <td class="py-3 text-gray-900 font-medium align-top">{{ $value }}</td>
                                            </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                @else
                                    <div class="flex flex-col items-center justify-center py-10 text-gray-400">
                                        <svg class="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                        <p class="italic">Spesifikasi teknis belum tersedia.</p>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>

    </main>

    <!-- Mobile Sticky Bottom Beli Button -->
    <div class="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-50 px-4 py-3 pb-safe">
        <div class="flex gap-3 max-w-md mx-auto">
            @if($product->preview_url)
            <a href="{{ $product->preview_url }}" target="_blank" class="flex-none flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </a>
            @endif
            
            <button type="button" onclick="shareProduct()" class="flex-none flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
            </button>

            <a href="{{ route('order.create', $product->id) }}" class="flex-1 flex items-center justify-center bg-[#d81b60] active:bg-[#b0164e] text-white font-bold rounded-xl h-12 transition-colors shadow-md shadow-pink-500/30">
                Beli Sekarang
            </a>
        </div>
    </div>

    <script>
        function shareProduct() {
            const url = window.location.href;
            const title = "{{ $product->name }}";
            const text = "Lihat produk keren ini: " + title;

            // Increment share count in backend
            fetch(`{{ route('product.share', $product->id) }}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                }
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    const el = document.getElementById('share-count');
                    if(el) el.innerText = data.shares;
                }
            })
            .catch(err => console.error(err));

            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: text,
                    url: url,
                })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
            } else {
                navigator.clipboard.writeText(url).then(function() {
                    alert('Link berhasil disalin ke clipboard!');
                }, function(err) {
                    console.error('Could not copy text: ', err);
                });
            }
        }
    </script>
@endsection
