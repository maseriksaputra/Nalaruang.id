@extends('layouts.main')

@section('content')

<!-- Etalase Template Section -->
    <section id="etalase" class="pt-32 pb-24 lg:pt-36 bg-sand" x-data="{
        sortBy: 'murah',
        packageFilter: 'all',
        activeCategory: '{{ $service->categories->first()->id ?? 'all' }}',
        get templates() {
            let categoriesData = {{ Js::from($service->categories ?? []) }};
            let directTemplates = {{ Js::from($service->templates ?? []) }};
            let data = [];
            
            if (categoriesData && categoriesData.length > 0) {
                let cat = categoriesData.find(c => c.id == this.activeCategory);
                if (cat) data = cat.templates || [];
            } else {
                data = directTemplates;
            }
            
            // Filter by package
            if (this.packageFilter !== 'all') {
                data = data.filter(t => t.package_id == this.packageFilter || !t.package_id);
            }
            
            // Sort
            data.sort((a, b) => {
                let priceA = parseFloat(a.price) || 0;
                let priceB = parseFloat(b.price) || 0;
                if (this.sortBy === 'murah') return priceA - priceB;
                if (this.sortBy === 'mahal') return priceB - priceA;
                return 0; // Default or random
            });
            
            return data;
        }
    }">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row justify-between items-end mb-8" data-aos="fade-up">
                <div>
                    <p class="text-brand-600 text-sm font-semibold tracking-widest mb-3 uppercase">Katalog {{ $service->title }}</p>
                    <h2 class="text-3xl md:text-5xl font-serif text-brand-900">Koleksi Desain Kami</h2>
                </div>
                
                <div class="mt-6 md:mt-0 flex flex-wrap gap-4">
                    <!-- Filter Paket -->
                    <select x-model="packageFilter" id="packageFilter" class="bg-white border border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer">
                        <option value="all">Semua Paket</option>
                        @foreach($service->packages as $pkg)
                        <option value="{{ $pkg->id }}">{{ $pkg->name }}</option>
                        @endforeach
                    </select>
                    
                    <!-- Urutkan -->
                    <select x-model="sortBy" class="bg-white border border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer">
                        <option value="murah">Termurah ke Termahal</option>
                        <option value="mahal">Termahal ke Termurah</option>
                    </select>
                </div>
            </div>

            @if($service->categories->count() > 0)
            <!-- Tabs Kategori -->
            <div class="flex flex-wrap gap-2 mb-10 border-b border-gray-200 pb-4" data-aos="fade-up">
                @foreach($service->categories as $category)
                <button @click="activeCategory = '{{ $category->id }}'" 
                        :class="{'bg-brand-600 text-white shadow-md': activeCategory == '{{ $category->id }}', 'bg-white text-gray-600 hover:bg-gray-50': activeCategory != '{{ $category->id }}'}"
                        class="whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border border-gray-200">
                    {{ $category->name }}
                </button>
                @endforeach
            </div>
            @endif

            <!-- Grid AlpineJS -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                <template x-for="template in templates" :key="template.id">
                    <div @click="window.location.href = '/p/' + template.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col h-full">
                        <div class="relative bg-gray-100 overflow-hidden"
                             x-bind:style="'aspect-ratio: ' + (template.image_aspect_ratio && template.image_aspect_ratio !== 'auto' ? (template.image_aspect_ratio.includes('/') ? template.image_aspect_ratio : '3/4') : 'auto')"
                             x-data="{ currentSlide: 0, slides: template.images ? [template.image, ...template.images].filter(Boolean) : (template.image ? [template.image] : ['']), init() { if (this.slides.length > 1) { setInterval(() => { this.currentSlide = this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1 }, 4000) } } }">
                            
                            <div class="absolute inset-0 w-full h-full flex transition-transform duration-700 ease-in-out"
                                 x-bind:style="'transform: translateX(-' + (currentSlide * 100) + '%)'">
                                <template x-for="(slide, index) in slides" :key="index">
                                    <img x-bind:src="slide ? (slide.startsWith('http') ? slide : window.ASSET_URL + slide) : 'https://placehold.co/600x800/eef2f0/2A4035?text=Preview+Desain'" 
                                         x-bind:alt="template.name" 
                                         class="w-full h-full object-cover shrink-0 transition-transform duration-700 group-hover:scale-105" />
                                </template>
                            </div>
                            
                            <!-- Slider Controls -->
                            <div x-show="slides.length > 1" class="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button @click.stop="currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1" class="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center shadow transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                                </button>
                                <button @click.stop="currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1" class="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center shadow transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </div>
                            
                            <!-- Overlay -->
                            <div class="absolute inset-0 bg-brand-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-2 z-10 pointer-events-none">
                                <div class="pointer-events-auto flex flex-col gap-2 w-full px-4 md:px-6">
                                    <template x-if="'{{ $service->slug }}' === 'event-digital'">
                                        <a x-bind:href="template.preview_url || '#'" 
                                           x-bind:target="template.preview_url ? '_blank' : '_self'"
                                           @click.stop="if(!template.preview_url) { $event.preventDefault(); alert('Demo belum tersedia untuk produk ini.'); }"
                                           class="w-full py-1.5 md:py-2 bg-white/20 hover:bg-white text-white hover:text-brand-900 rounded-full text-[10px] md:text-xs font-medium transition backdrop-blur-sm text-center">
                                           Lihat Demo
                                        </a>
                                    </template>
                                    <template x-if="'{{ $service->slug }}' !== 'event-digital'">
                                        <button @click.prevent.stop="$dispatch('open-lightbox', { images: slides })" 
                                           class="w-full py-1.5 md:py-2 bg-white/20 hover:bg-white text-white hover:text-brand-900 rounded-full text-[10px] md:text-xs font-medium transition backdrop-blur-sm text-center">
                                           Lihat Gambar
                                        </button>
                                    </template>
                                    <a :href="'/p/' + template.id" @click.stop class="w-full py-1.5 md:py-2 bg-brand-500 hover:bg-brand-400 text-white rounded-full text-[10px] md:text-xs font-bold transition shadow-lg text-center">
                                        Detail Produk
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="p-4 md:p-6 flex flex-col flex-grow">
                            <div class="flex flex-col md:flex-row justify-between items-start mb-2 gap-1 md:gap-2">
                                <h3 class="text-base md:text-xl font-serif text-brand-900 group-hover:text-brand-600 transition line-clamp-2 md:line-clamp-1 leading-snug" x-text="template.name"></h3>
                                <span class="bg-brand-50 text-brand-600 text-[9px] md:text-[10px] font-bold uppercase px-2 py-1 rounded whitespace-nowrap self-start mt-1 md:mt-0" x-show="template.category" x-text="template.category"></span>
                            </div>
                            <div class="mt-auto pt-3 flex flex-col">
                                <template x-if="template.discount_price">
                                    <div class="text-gray-400 text-[11px] md:text-xs line-through mb-0.5">
                                        Rp <span x-text="parseFloat(template.price || 0).toLocaleString('id-ID')"></span>
                                    </div>
                                </template>
                                <div class="text-brand-600 font-bold" :class="template.discount_price ? 'text-base md:text-lg' : 'text-base md:text-lg'">
                                    Rp <span x-text="parseFloat(template.discount_price || template.price || 0).toLocaleString('id-ID')"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            
            <div x-show="templates.length === 0" class="text-center py-12 text-gray-500">
                Belum ada desain yang tersedia untuk filter ini.
            </div>
        </div>
    </section>

<!-- Packages / Pricing Section -->
    <section id="packages" class="py-24 bg-sand relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16" data-aos="fade-up">
                <p class="text-brand-600 text-sm font-semibold tracking-widest mb-3 uppercase">Pilihan Harga</p>
                <h2 class="text-3xl md:text-5xl font-serif text-brand-900 mb-6">Paket Spesial Kami</h2>
                <div class="w-20 h-[1px] bg-brand-600 mx-auto"></div>
            </div>

            @if($service->packages->count() > 0)
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-center">
                    @foreach($service->packages as $package)
                    <div class="pricing-card bg-white rounded-2xl border {{ $package->is_popular ? 'border-brand-500 shadow-2xl scale-105 z-10' : 'border-gray-100 shadow-lg' }} overflow-hidden flex flex-col relative transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl" data-aos="fade-up" data-aos-delay="{{ $loop->iteration * 100 }}">
                        @if($package->is_popular)
                        <div class="bg-brand-500 text-white text-xs font-bold uppercase tracking-wider py-2 text-center">
                            Paling Diminati
                        </div>
                        @endif
                        
                        <div class="p-8 pb-6 border-b border-gray-50 text-center">
                            <h3 class="text-2xl font-serif text-brand-900 mb-4">{{ $package->name }}</h3>
                            <div class="flex items-baseline justify-center gap-1 mb-2">
                                <span class="text-sm text-gray-500 font-medium">Rp</span>
                                <span class="text-4xl font-bold text-brand-600">{{ $package->price }}</span>
                            </div>
                            @if($package->description)
                            <p class="text-sm text-gray-500 mt-4">{{ $package->description }}</p>
                            @endif
                        </div>

                        <div class="p-8 pt-6 flex-grow flex flex-col">
                            <ul class="space-y-4 mb-8 flex-grow text-sm text-gray-600">
                                @if(is_array($package->features))
                                    @foreach($package->features as $feature)
                                    <li class="flex items-start">
                                        <svg class="w-5 h-5 text-brand-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                        <span>{{ $feature }}</span>
                                    </li>
                                    @endforeach
                                @endif
                            </ul>

                            <button onclick="document.getElementById('packageFilter').value = '{{ $package->id }}'; document.getElementById('packageFilter').dispatchEvent(new Event('change')); document.getElementById('etalase').scrollIntoView({behavior: 'smooth'})" class="block w-full py-3.5 px-4 text-center rounded-xl text-sm font-semibold transition-colors duration-300 {{ $package->is_popular ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md' : 'bg-brand-50 text-brand-600 hover:bg-brand-100' }}">
                                Pilih Paket Ini
                            </button>
                        </div>
                    </div>
                    @endforeach
                </div>
            @else
                <div class="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm" data-aos="fade-up">
                    <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    <h3 class="text-xl font-serif text-brand-900 mb-2">Paket Belum Tersedia</h3>
                    <p class="text-gray-500 max-w-md mx-auto">Kami sedang menyiapkan paket terbaik untuk layanan ini. Silakan hubungi kami untuk informasi lebih lanjut atau kustomisasi.</p>
                    <a href="https://wa.me/6285196811112" target="_blank" class="inline-block mt-6 px-6 py-2.5 bg-brand-600 text-white rounded-full text-sm font-medium hover:bg-brand-700 transition-colors">Hubungi Kami</a>
                </div>
                <div class="text-center mt-12" data-aos="fade-up">
                    <p class="text-gray-500 mb-4">Butuh kustomisasi khusus atau paket yang berbeda?</p>
                    <a href="https://wa.me/6285196811112" target="_blank" class="inline-block mt-6 px-6 py-2.5 bg-brand-600 text-white rounded-full text-sm font-medium hover:bg-brand-700 transition-colors">Hubungi Kami</a>
                </div>
            @endif
        </div>
    </section>

<!-- Cara Kerja Section -->
    <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16" data-aos="fade-up">
                <h2 class="text-3xl md:text-4xl font-serif text-brand-900 mb-4">Cara Kerja dalam 5 Langkah Mudah</h2>
                <p class="text-gray-500">
                    {{ $service->slug == 'event-digital' 
                        ? 'Buat undangan digital cantik dan lengkap hanya dalam beberapa menit.' 
                        : 'Proses pemesanan cetak fisik yang cepat, mudah, dan berkualitas premium.' }}
                </p>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-5 gap-8 text-center relative">
                <!-- Line connecting steps (hidden on mobile) -->
                <div class="hidden md:block absolute top-8 left-[10%] right-[10%] h-[1px] bg-brand-100 z-0"></div>
                
                <div class="relative z-10" data-aos="fade-up" data-aos-delay="100">
                    <div class="w-16 h-16 mx-auto bg-white border-2 border-brand-500 rounded-full flex items-center justify-center text-brand-800 font-bold text-xl mb-4 shadow-sm">1</div>
                    <h4 class="font-medium text-brand-900 text-sm">
                        {{ $service->slug == 'event-digital' ? 'Pilih Desain Tema' : 'Pilih Desain / Produk' }}
                    </h4>
                </div>
                <div class="relative z-10" data-aos="fade-up" data-aos-delay="200">
                    <div class="w-16 h-16 mx-auto bg-white border-2 border-brand-500 rounded-full flex items-center justify-center text-brand-800 font-bold text-xl mb-4 shadow-sm">2</div>
                    <h4 class="font-medium text-brand-900 text-sm">
                        {{ $service->slug == 'event-digital' ? 'Pilih Paket Harga' : 'Tentukan Spesifikasi Cetak' }}
                    </h4>
                </div>
                <div class="relative z-10" data-aos="fade-up" data-aos-delay="300">
                    <div class="w-16 h-16 mx-auto bg-white border-2 border-brand-500 rounded-full flex items-center justify-center text-brand-800 font-bold text-xl mb-4 shadow-sm">3</div>
                    <h4 class="font-medium text-brand-900 text-sm">
                        {{ $service->slug == 'event-digital' ? 'Lengkapi Data & Daftar Tamu' : 'Kirim File / Detail Request' }}
                    </h4>
                </div>
                <div class="relative z-10" data-aos="fade-up" data-aos-delay="400">
                    <div class="w-16 h-16 mx-auto bg-white border-2 border-brand-500 rounded-full flex items-center justify-center text-brand-800 font-bold text-xl mb-4 shadow-sm">4</div>
                    <h4 class="font-medium text-brand-900 text-sm">
                        {{ $service->slug == 'event-digital' ? 'Tim Kami Memproses Pembuatan' : 'Proses Produksi / Cetak' }}
                    </h4>
                </div>
                <div class="relative z-10 col-span-2 md:col-span-1" data-aos="fade-up" data-aos-delay="500">
                    <div class="w-16 h-16 mx-auto bg-brand-500 border-2 border-brand-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-md">5</div>
                    <h4 class="font-medium text-brand-900 text-sm">
                        {{ $service->slug == 'event-digital' ? 'Undangan Siap Dibagikan' : 'Pesanan Siap Dikirim' }}
                    </h4>
                </div>
            </div>
        </div>
    </section>

<!-- Custom Request Banner -->
    <section class="py-20 bg-brand-900 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10" style="background-image: url('https://www.transparenttextures.com/patterns/stardust.png');"></div>
        <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 class="text-3xl md:text-4xl font-serif text-white mb-6 italic">Tidak Menemukan yang Cocok?</h2>
            <p class="text-brand-100 mb-8 font-light leading-relaxed">Kami sangat fleksibel! Beri tahu kami kebutuhan spesifik Anda, kami siap mewujudkan kustomisasi unik yang tidak ada di paket standar.</p>
            <a href="https://wa.me/6285196811112?text=Halo,%20saya%20ingin%20konsultasi%20layanan%20kustom%20untuk%20{{ urlencode($service->title) }}" target="_blank" class="inline-block bg-white text-brand-900 px-8 py-3.5 rounded-full text-sm font-bold shadow-xl hover:scale-105 transform transition duration-300">
                Konsultasi Layanan Custom
            </a>
        </div>
    </section>

@include('components.lightbox')
@endsection
