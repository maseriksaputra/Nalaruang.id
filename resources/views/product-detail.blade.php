<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $product->name }} - Nalaruang</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; }
        .prose img { max-width: 100%; border-radius: 0.5rem; }
        .prose p { margin-bottom: 0.75rem; color: #475569; }
        .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; color: #475569; }
        .prose ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; color: #475569; }
        .prose h2, .prose h3 { font-weight: 700; color: #1e293b; margin-top: 1.5rem; margin-bottom: 0.75rem; }
    </style>
</head>
<body class="pb-24">

    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-md mx-auto px-4 py-4 flex items-center">
            <a href="javascript:history.back()" class="mr-4 text-gray-500 hover:text-gray-900">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </a>
            <h1 class="font-bold text-lg text-gray-900 truncate">Detail Produk</h1>
        </div>
    </header>

    <main class="max-w-md mx-auto bg-white min-h-screen">
        
        <!-- Product Image Slider (Simplified to single for now, or carousel if images exist) -->
        <div class="w-full bg-gray-100 aspect-[4/3] relative overflow-hidden">
            @if($product->image)
                <img src="{{ rtrim(str_replace('test.txt', '', Storage::url('test.txt')), '/') . '/' . $product->image }}" alt="{{ $product->name }}" class="w-full h-full object-cover">
            @else
                <img src="https://placehold.co/800x600/e2e8f0/64748b?text=No+Image" alt="No Image" class="w-full h-full object-cover">
            @endif
        </div>

        <!-- Product Info -->
        <div class="p-4 border-b border-gray-100">
            <div class="flex items-center gap-2 mb-2">
                @if($product->serviceCategory)
                    <span class="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded">{{ $product->serviceCategory->name }}</span>
                @elseif($product->category)
                    <span class="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded">{{ $product->category }}</span>
                @endif
                
                @if(($product->stok ?? 0) > 0)
                    <span class="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded">Stok Tersedia</span>
                @else
                    <span class="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded">Stok Habis</span>
                @endif
            </div>

            <h2 class="text-xl font-bold text-gray-900 leading-tight mb-2">{{ $product->name }}</h2>
            
            <div class="flex flex-col mb-3">
                @if($product->discount_price)
                    <span class="text-sm text-gray-400 line-through">Rp {{ number_format($product->price, 0, ',', '.') }}</span>
                    <span class="text-2xl font-extrabold text-[#d81b60]">Rp {{ number_format($product->discount_price, 0, ',', '.') }}</span>
                @else
                    <span class="text-2xl font-extrabold text-[#d81b60]">Rp {{ number_format($product->price, 0, ',', '.') }}</span>
                @endif
            </div>

            <div class="flex items-center text-sm text-gray-500 gap-4 mt-2 pt-3 border-t border-gray-100">
                <div class="flex items-center gap-1">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    <span>{{ ($product->demo_views ?? 0) + ($product->total_invitation_views ?? 0) }} Views</span>
                </div>
                <div class="flex items-center gap-1">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    <span>{{ $product->orders_count ?? 0 }} Terjual</span>
                </div>
            </div>
        </div>

        <div class="w-full h-2 bg-gray-100"></div>

        <!-- Specifications -->
        @if(!empty($product->specifications) && is_array($product->specifications))
        <div class="p-4">
            <h3 class="font-bold text-gray-900 mb-3 text-lg">Spesifikasi</h3>
            <div class="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                <table class="w-full text-sm text-left">
                    <tbody>
                        @foreach($product->specifications as $key => $value)
                        <tr class="border-b border-gray-100 last:border-0">
                            <th class="px-4 py-3 font-medium text-gray-500 bg-gray-50/50 w-1/3 whitespace-nowrap">{{ $key }}</th>
                            <td class="px-4 py-3 text-gray-900 font-medium bg-white">{{ $value }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
        <div class="w-full h-2 bg-gray-100"></div>
        @endif

        <!-- Description -->
        <div class="p-4 mb-8">
            <h3 class="font-bold text-gray-900 mb-3 text-lg">Deskripsi Produk</h3>
            <div class="prose text-sm">
                @if($product->description)
                    {!! $product->description !!}
                @else
                    <p class="text-gray-400 italic">Belum ada deskripsi untuk produk ini.</p>
                @endif
            </div>
        </div>

    </main>

    <!-- Sticky Bottom Beli Button -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div class="max-w-md mx-auto px-4 py-3 flex gap-3">
            @if($product->preview_url)
            <a href="{{ $product->preview_url }}" target="_blank" class="flex-none flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </a>
            @endif
            
            <a href="{{ route('order.create', $product->id) }}" class="flex-1 flex items-center justify-center bg-[#d81b60] hover:bg-[#b0164e] text-white font-bold rounded-xl h-12 transition shadow-md shadow-pink-500/30">
                Beli Sekarang
            </a>
        </div>
    </div>

</body>
</html>
