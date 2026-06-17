@extends('layouts.main')
@section('content')

    <!-- Hero Section dengan Image Slideshow Geser Kanan-Kiri -->
    <section id="beranda" class="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-brand-900">
        <!-- Slideshow Container -->
        <div class="absolute inset-0 w-full h-full z-0 overflow-hidden">
            <div id="hero-slider-track" class="flex h-full w-full">
                @forelse($heroSlides as $slide)
                <img src="{{ Storage::url($slide->image) }}" alt="{{ $slide->title }}" class="flex-none w-full h-full object-cover object-center vintage-film bg-brand-800">
                @empty
                <!-- Slide 1: Pernikahan / Wedding -->
                <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1920" alt="Pernikahan" class="flex-none w-full h-full object-cover object-center vintage-film bg-brand-800">
                <!-- Slide 2: Cincin Kawin -->
                <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1920" alt="Cincin Kawin" class="flex-none w-full h-full object-cover object-center vintage-film bg-brand-800">
                <!-- Slide 3: Digital Printing / Kertas Undangan (URL DIPERBARUI) -->
                <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1920" alt="Digital Printing" class="flex-none w-full h-full object-cover object-center vintage-film bg-brand-800">
                <!-- Slide 4: Web / Mobile App Dev (IT) -->
                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1920" alt="Web Development IT" class="flex-none w-full h-full object-cover object-center vintage-film bg-brand-800">
                <!-- Slide 5: Souvenir / Gift -->
                <img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=1920" alt="Souvenir Acara" class="flex-none w-full h-full object-cover object-center vintage-film bg-brand-800">
                @endforelse
            </div>
            
            <div class="absolute inset-0 hero-overlay z-10 pointer-events-none"></div>
        </div>

        <!-- Teks Hero -->
        <div class="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16" data-aos="fade-up" data-aos-duration="1200">
            <p class="text-white/80 text-sm font-semibold tracking-widest mb-4 uppercase flex items-center justify-center gap-3">
                <span class="w-10 h-[1px] bg-white/50"></span> Best Choice <span class="w-10 h-[1px] bg-white/50"></span>
            </p>
            <h1 class="text-5xl md:text-7xl font-serif text-white mb-4 italic drop-shadow-lg">Web & Print Solution</h1>
            
            <h2 class="text-2xl md:text-3xl text-white font-light tracking-widest-xl mb-6 mt-8 drop-shadow-md">
                E R I K A &nbsp;&amp;&nbsp; D I N D A
            </h2>
            
            <p class="text-white/90 text-sm md:text-base mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                Platform percetakan estetik dan teknologi terintegrasi. Dari undangan cetak premium, merchandise custom, website pernikahan interaktif, hingga pengembangan aplikasi bisnis modern.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#katalog" class="inline-flex justify-center items-center gap-2 bg-brand-800/90 hover:bg-brand-600 backdrop-blur-sm text-white px-8 py-3.5 rounded-full text-sm font-medium transition duration-300 border border-white/10 hover:shadow-lg hover:shadow-brand-800/50">
                    Eksplorasi Layanan
                </a>
                <a href="#portofolio" class="inline-flex justify-center items-center gap-2 bg-transparent hover:bg-white/10 text-white px-8 py-3.5 rounded-full text-sm font-medium transition duration-300 border border-white/50">
                    Lihat Portofolio
                </a>
            </div>
        </div>
    </section>

    <!-- Stats Bar -->
    <section class="bg-brand-800 py-10 relative z-20 shadow-xl">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-brand-600">
                <div class="flex flex-col items-center justify-center text-center px-4" data-aos="fade-up" data-aos-delay="100">
                    <span class="text-4xl font-serif text-white mb-2">50K+</span>
                    <p class="text-brand-100 text-sm italic">Produk Cetak & Merchandise Terjual</p>
                </div>
                <div class="flex flex-col items-center justify-center text-center px-4 pt-8 md:pt-0" data-aos="fade-up" data-aos-delay="200">
                    <span class="text-4xl font-serif text-white mb-2">5.000+</span>
                    <p class="text-brand-100 text-sm italic">Undangan Digital & Website Dibuat</p>
                </div>
                <div class="flex flex-col items-center justify-center text-center px-4 pt-8 md:pt-0" data-aos="fade-up" data-aos-delay="300">
                    <span class="text-4xl font-serif text-white mb-2">100%</span>
                    <p class="text-brand-100 text-sm italic">Garansi Kualitas & Kepuasan Klien</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Katalog Layanan Section -->
    <section id="katalog" class="py-24 bg-white relative">
        <div class="absolute inset-0 opacity-[0.02]" style="background-image: radial-gradient(#2A4035 1px, transparent 1px); background-size: 32px 32px;"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="text-center mb-16" data-aos="fade-up">
                <p class="text-brand-600 text-sm font-semibold tracking-widest mb-3 uppercase">Layanan Lengkap Kami</p>
                <h2 class="text-3xl md:text-5xl font-serif text-brand-900 mb-6">Pilihan Katalog</h2>
                <div class="w-20 h-[1px] bg-brand-800 mx-auto"></div>
            </div>

            <!-- GRID KARTU LAYANAN -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                @forelse($services as $service)
                <div class="service-card bg-sand hover:bg-brand-900 p-8 rounded-xl border border-gray-100 group flex flex-col relative overflow-hidden cursor-pointer" data-aos="fade-up" data-aos-delay="{{ $loop->iteration * 100 }}">
                    @if($service->is_popular)
                    <div class="absolute top-0 right-0 bg-brand-800 text-white group-hover:bg-white group-hover:text-brand-900 transition-colors duration-500 text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg">Terpopuler</div>
                    @endif
                    <div class="w-14 h-14 bg-brand-100 group-hover:bg-brand-800 rounded-full flex items-center justify-center mb-6 text-brand-800 group-hover:text-white transition-colors duration-500 transform group-hover:scale-110">
                        {!! $service->icon ?? '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>' !!}
                    </div>
                    <h3 class="text-xl font-serif text-brand-900 group-hover:text-white transition-colors duration-500 mb-4">{{ $service->title }}</h3>
                    <ul class="text-gray-600 group-hover:text-brand-100 transition-colors duration-500 text-sm mb-8 space-y-3 flex-grow">
                        @if(is_array($service->features))
                            @foreach($service->features as $feature)
                            <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> {{ $feature }}</li>
                            @endforeach
                        @endif
                    </ul>
                    <a href="{{ $service->slug ? route('service.show', $service->slug) : '#' }}" class="inline-flex items-center text-brand-800 group-hover:text-white text-sm font-semibold transition-colors duration-500">
                        Detail Layanan <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </a>
                </div>
                @empty
                <!-- Card 1: Digital Printing Fisik -->
                <div class="service-card bg-sand hover:bg-brand-900 p-8 rounded-xl border border-gray-100 group flex flex-col relative overflow-hidden cursor-pointer" data-aos="fade-up" data-aos-delay="100">
                    <div class="w-14 h-14 bg-brand-100 group-hover:bg-brand-800 rounded-full flex items-center justify-center mb-6 text-brand-800 group-hover:text-white transition-colors duration-500 transform group-hover:scale-110">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    </div>
                    <h3 class="text-xl font-serif text-brand-900 group-hover:text-white transition-colors duration-500 mb-4">Cetak Fisik Premium</h3>
                    <ul class="text-gray-600 group-hover:text-brand-100 transition-colors duration-500 text-sm mb-8 space-y-3 flex-grow">
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> Undangan Pernikahan Eksklusif</li>
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> Custom Lanyard & ID Card</li>
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> Buku Yasin & Majmu premium</li>
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> Jasa Print & Fotocopy Dokumen</li>
                    </ul>
                    <a href="#" class="inline-flex items-center text-brand-800 group-hover:text-white text-sm font-semibold transition-colors duration-500">
                        Detail Layanan <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </a>
                </div>

                <!-- Card 2: Undangan Digital -->
                <div class="service-card bg-sand hover:bg-brand-900 p-8 rounded-xl border border-gray-100 group flex flex-col relative overflow-hidden cursor-pointer" data-aos="fade-up" data-aos-delay="200">
                    <div class="absolute top-0 right-0 bg-brand-800 text-white group-hover:bg-white group-hover:text-brand-900 transition-colors duration-500 text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg">Terpopuler</div>
                    <div class="w-14 h-14 bg-brand-100 group-hover:bg-brand-800 rounded-full flex items-center justify-center mb-6 text-brand-800 group-hover:text-white transition-colors duration-500 transform group-hover:scale-110">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                    </div>
                    <h3 class="text-xl font-serif text-brand-900 group-hover:text-white transition-colors duration-500 mb-4">Event Digital</h3>
                    <ul class="text-gray-600 group-hover:text-brand-100 transition-colors duration-500 text-sm mb-8 space-y-3 flex-grow">
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> Website Undangan Interaktif</li>
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> Video Undangan Cinematic</li>
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> Buku Tamu Digital (QR Code)</li>
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> RSVP & Filter Instagram Acara</li>
                    </ul>
                    <a href="#" class="inline-flex items-center text-brand-800 group-hover:text-white text-sm font-semibold transition-colors duration-500">
                        Detail Layanan <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </a>
                </div>

                <!-- Card 3: Souvenir -->
                <div class="service-card bg-sand hover:bg-brand-900 p-8 rounded-xl border border-gray-100 group flex flex-col relative overflow-hidden cursor-pointer" data-aos="fade-up" data-aos-delay="300">
                    <div class="w-14 h-14 bg-brand-100 group-hover:bg-brand-800 rounded-full flex items-center justify-center mb-6 text-brand-800 group-hover:text-white transition-colors duration-500 transform group-hover:scale-110">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
                    </div>
                    <h3 class="text-xl font-serif text-brand-900 group-hover:text-white transition-colors duration-500 mb-4">Souvenir & Merchandise</h3>
                    <ul class="text-gray-600 group-hover:text-brand-100 transition-colors duration-500 text-sm mb-8 space-y-3 flex-grow">
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> Tumbler & Gelas Kaca Custom</li>
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> Tasbih Premium & Box Estetik</li>
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> Totebag Canvas Sablon</li>
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> Plakat Akrilik & Kayu</li>
                    </ul>
                    <a href="#" class="inline-flex items-center text-brand-800 group-hover:text-white text-sm font-semibold transition-colors duration-500">
                        Detail Layanan <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </a>
                </div>

                <!-- Card 4: Web & App Design -->
                <div class="service-card bg-sand hover:bg-brand-900 p-8 rounded-xl border border-gray-100 group flex flex-col relative overflow-hidden cursor-pointer" data-aos="fade-up" data-aos-delay="400">
                    <div class="w-14 h-14 bg-brand-100 group-hover:bg-brand-800 rounded-full flex items-center justify-center mb-6 text-brand-800 group-hover:text-white transition-colors duration-500 transform group-hover:scale-110">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                    </div>
                    <h3 class="text-xl font-serif text-brand-900 group-hover:text-white transition-colors duration-500 mb-4">Web & Mobile App</h3>
                    <ul class="text-gray-600 group-hover:text-brand-100 transition-colors duration-500 text-sm mb-8 space-y-3 flex-grow">
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> UI/UX Design & Prototyping</li>
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> Landing Page & Company Profile</li>
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> Aplikasi Bisnis / Kasir Mobile</li>
                        <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> Sistem Reservasi Custom</li>
                    </ul>
                    <a href="#" class="inline-flex items-center text-brand-800 group-hover:text-white text-sm font-semibold transition-colors duration-500">
                        Detail Layanan <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </a>
                </div>
                @endforelse
            </div>
        </div>
    </section>

    <!-- Produk Katalog Slider Section -->
    <section id="produk-katalog" class="pt-10 pb-24 bg-brand-100 relative border-t border-brand-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="text-center mb-16" data-aos="fade-up">
                <h2 class="text-3xl md:text-5xl font-serif text-brand-900 mb-4 italic">Katalog Produk</h2>
                <div class="w-16 h-[1px] bg-brand-800 mx-auto mb-4"></div>
                <p class="text-gray-500 italic text-sm md:text-base">Eksplorasi ragam pilihan karya dan produk cetak eksklusif kami.</p>
            </div>

            @foreach($services as $service)
                @if($service->templates->count() > 0)
                <div class="mb-16 last:mb-0" data-aos="fade-up">
                    <div class="flex flex-col md:flex-row justify-between items-end mb-6">
                        <div>
                            <h3 class="text-2xl font-serif text-brand-900 mb-1">{{ $service->title }}</h3>
                            <p class="text-sm text-brand-600">{{ $service->templates->count() }} Produk Tersedia</p>
                        </div>
                        <a href="{{ $service->slug ? route('service.show', $service->slug) : '#' }}" class="mt-4 md:mt-0 text-brand-600 hover:text-brand-800 text-sm font-semibold inline-flex items-center group transition-colors">
                            Lihat Selengkapnya 
                            <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </a>
                    </div>
                    
                    <!-- Horizontal Slider Container -->
                    <div class="flex overflow-x-auto hide-scrollbar gap-6 snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 relative">
                        @foreach($service->templates as $template)
                        <div class="snap-start shrink-0 w-[280px] sm:w-[320px] bg-sand rounded-xl border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500 flex flex-col relative hover:-translate-y-2">
                            @if($template->stok <= 0)
                                <div class="absolute top-3 right-3 bg-red-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full z-10 shadow-md tracking-wider">Habis</div>
                            @elseif($template->stok < 10)
                                <div class="absolute top-3 right-3 bg-amber-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full z-10 shadow-md tracking-wider">Sisa {{ $template->stok }}</div>
                            @endif
                            
                            <!-- Image Container -->
                            <div class="relative w-full aspect-[4/3] bg-gray-200 overflow-hidden">
                                @if($template->image)
                                    <img src="{{ Storage::url($template->image) }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="{{ $template->name }}">
                                @else
                                    <div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-serif italic">No Img</div>
                                @endif
                                <div class="absolute inset-0 bg-brand-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                    <a href="{{ $service->slug ? route('service.show', $service->slug) : '#' }}" class="bg-white/20 hover:bg-brand-600 text-white text-sm font-medium px-6 py-2.5 rounded-full border border-white/50 transition-all duration-300 transform scale-90 group-hover:scale-100">
                                        Lihat Detail
                                    </a>
                                </div>
                            </div>
                            
                            <!-- Content -->
                            <div class="p-6 flex flex-col flex-grow relative">
                                <!-- Bookmark/Favorite Icon -->
                                <button class="absolute top-6 right-6 text-gray-300 hover:text-brand-500 transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                </button>
                                
                                <span class="text-[10px] font-bold tracking-wider text-brand-600 uppercase mb-2">{{ $template->category ?? $service->title }}</span>
                                <h4 class="font-serif text-brand-900 text-xl mb-2 line-clamp-1 group-hover:text-brand-600 transition-colors">{{ $template->name }}</h4>
                                
                                <div class="mt-auto pt-5 flex items-center justify-between border-t border-gray-100">
                                    <div class="flex flex-col">
                                        @if($template->discount_price && $template->discount_price < $template->price)
                                            <span class="text-xs text-gray-400 line-through mb-0.5">Rp {{ number_format($template->price, 0, ',', '.') }}</span>
                                            <span class="text-brand-600 font-bold text-lg">Rp {{ number_format($template->discount_price, 0, ',', '.') }}</span>
                                        @else
                                            <span class="text-brand-600 font-bold text-lg">Rp {{ number_format($template->price, 0, ',', '.') }}</span>
                                        @endif
                                    </div>
                                    <a href="{{ route('order.create', $template->id) }}" class="w-10 h-10 rounded-full bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white hover:shadow-lg hover:shadow-brand-600/30 flex items-center justify-center transition-all duration-300">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
                @endif
            @endforeach
        </div>
    </section>

    <!-- Portofolio Section -->
    <section id="portofolio" class="py-24 bg-sand">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row justify-between items-end mb-12" data-aos="fade-up">
                <div>
                    <h2 class="text-3xl md:text-5xl font-serif text-brand-900 mb-4 italic">Karya Portofolio</h2>
                    <p class="text-gray-500 max-w-xl">Inspirasi dari ragam karya terbaik yang telah kami ciptakan, menggabungkan seni visual cetak dan teknologi.</p>
                </div>
                <div class="mt-6 md:mt-0">
                    <a href="#" class="border border-brand-800 text-brand-900 hover:bg-brand-800 hover:text-white px-6 py-2.5 rounded-full text-sm font-medium transition duration-300">
                        Lihat Semua Karya
                    </a>
                </div>
            </div>

            <!-- Portfolio Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                @forelse($portfolios as $portfolio)
                <div class="portfolio-item rounded-xl relative aspect-square {{ $loop->iteration % 4 == 1 || $loop->iteration % 4 == 0 ? 'md:col-span-2' : '' }} group" data-aos="zoom-in" data-aos-delay="{{ $loop->iteration * 100 }}">
                    <img src="{{ Storage::url($portfolio->image) }}" class="portfolio-img w-full h-full object-cover {{ $loop->iteration % 2 == 0 ? 'vintage-film' : '' }}" alt="{{ $portfolio->title }}">
                    <div class="portfolio-overlay absolute inset-0 flex flex-col justify-end p-8">
                        <div class="portfolio-text">
                            <span class="text-brand-100 text-xs font-bold tracking-wider uppercase mb-2 block">{{ $portfolio->category }}</span>
                            <h3 class="text-2xl font-serif text-white">{{ $portfolio->title }}</h3>
                        </div>
                    </div>
                </div>
                @empty
                <!-- Portofolio 1 (Website Undangan) -->
                <div class="portfolio-item rounded-xl relative aspect-square md:col-span-2 group" data-aos="zoom-in" data-aos-delay="100">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" class="portfolio-img w-full h-full object-cover" alt="Undangan Website">
                    <div class="portfolio-overlay absolute inset-0 flex flex-col justify-end p-8">
                        <div class="portfolio-text">
                            <span class="text-brand-100 text-xs font-bold tracking-wider uppercase mb-2 block">Event Digital</span>
                            <h3 class="text-2xl font-serif text-white">Website Undangan Interaktif</h3>
                        </div>
                    </div>
                </div>

                <!-- Portofolio 2 (Cetak Undangan Fisik) -->
                <div class="portfolio-item rounded-xl relative aspect-square group" data-aos="zoom-in" data-aos-delay="200">
                    <img src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&q=80&w=800" class="portfolio-img w-full h-full object-cover vintage-film" alt="Undangan Fisik Rustic">
                    <div class="portfolio-overlay absolute inset-0 flex flex-col justify-end p-6">
                        <div class="portfolio-text">
                            <span class="text-brand-100 text-xs font-bold tracking-wider uppercase mb-1 block">Cetak Premium</span>
                            <h3 class="text-lg font-serif text-white">Rustic Aesthetic Letter</h3>
                        </div>
                    </div>
                </div>

                <!-- Portofolio 3 (Merchandise/Lanyard) -->
                <div class="portfolio-item rounded-xl relative aspect-square group" data-aos="zoom-in" data-aos-delay="300">
                    <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800" class="portfolio-img w-full h-full object-cover" alt="Merchandise Lanyard">
                    <div class="portfolio-overlay absolute inset-0 flex flex-col justify-end p-6">
                        <div class="portfolio-text">
                            <span class="text-brand-100 text-xs font-bold tracking-wider uppercase mb-1 block">Corporate Stuff</span>
                            <h3 class="text-lg font-serif text-white">ID Card & Custom Lanyard</h3>
                        </div>
                    </div>
                </div>

                <!-- Portofolio 4 (Souvenir Tumbler) -->
                <div class="portfolio-item rounded-xl relative aspect-[2/1] md:col-span-2 group" data-aos="zoom-in" data-aos-delay="400">
                    <img src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=1000" class="portfolio-img w-full h-full object-cover" alt="Tumbler Custom">
                    <div class="portfolio-overlay absolute inset-0 flex flex-col justify-end p-8">
                        <div class="portfolio-text">
                            <span class="text-brand-100 text-xs font-bold tracking-wider uppercase mb-2 block">Souvenir Eksklusif</span>
                            <h3 class="text-2xl font-serif text-white">Tumbler Minimalis Custom</h3>
                        </div>
                    </div>
                </div>
                @endforelse
            </div>
        </div>
    </section>

    <!-- Mid Banner Section -->
    <section class="relative py-32 mt-10">
        <div class="absolute inset-0 w-full h-full bg-fixed" style="background-image: url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1920'); background-size: cover; background-position: center;">
            <div class="absolute inset-0 mid-overlay"></div>
        </div>
        
        <div class="relative z-10 text-center px-4 max-w-3xl mx-auto" data-aos="fade-up">
            <h2 class="text-4xl md:text-5xl font-serif text-white mb-6 italic drop-shadow-md">
                Wujudkan Ide Brilian Anda<br>Bersama Kami
            </h2>
            <p class="text-white/90 text-sm md:text-base mb-10 font-light italic">
                Baik itu merencanakan hari pernikahan yang sempurna atau membangun ekosistem digital untuk bisnis Anda, kami siap merealisasikannya.
            </p>
            <a href="#kontak" class="inline-block bg-brand-500/90 hover:bg-brand-500 backdrop-blur-md text-white px-8 py-3.5 rounded-full text-sm font-medium transition duration-300 border border-white/20 hover:scale-105 transform shadow-2xl">
                KONSULTASI SEKARANG
            </a>
        </div>
    </section>

    <!-- Testimonial / Review Section -->
    <section id="review" class="py-24 bg-white relative overflow-hidden">
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-brand-50 opacity-50 blur-3xl"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="text-center mb-16" data-aos="fade-up">
                <h2 class="text-3xl md:text-5xl font-serif text-brand-900 mb-4 italic">Cerita Mereka</h2>
                <div class="w-16 h-[1px] bg-brand-800 mx-auto mb-4"></div>
                <p class="text-gray-500 italic text-sm md:text-base">Apa kata pasangan dan klien tentang pengalaman berkolaborasi bersama kami.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                @forelse($testimonials as $testimonial)
                <div class="{{ $loop->iteration % 2 == 0 ? 'bg-sand p-8 rounded-2xl border border-gray-100 relative group hover:shadow-xl transition duration-300 transform md:-translate-y-4' : ($loop->iteration % 3 == 0 ? 'bg-brand-900 p-8 rounded-2xl border border-brand-800 relative group hover:shadow-2xl transition duration-300' : 'bg-sand p-8 rounded-2xl border border-gray-100 relative group hover:shadow-xl transition duration-300') }}" data-aos="fade-up" data-aos-delay="{{ $loop->iteration * 100 }}">
                    <div class="{{ $loop->iteration % 3 == 0 ? 'text-brand-600' : 'text-brand-300' }} mb-4">
                        <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                    </div>
                    <p class="{{ $loop->iteration % 3 == 0 ? 'text-gray-300' : 'text-gray-600' }} mb-6 italic text-sm leading-relaxed">"{{ $testimonial->content }}"</p>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 {{ $loop->iteration % 3 == 0 ? 'bg-brand-800' : 'bg-gray-200' }} rounded-full overflow-hidden">
                            @if($testimonial->avatar)
                                <img src="{{ Storage::url($testimonial->avatar) }}" alt="{{ $testimonial->client_name }}" class="w-full h-full object-cover">
                            @else
                                <div class="w-full h-full flex items-center justify-center font-bold text-gray-500">{{ substr($testimonial->client_name, 0, 1) }}</div>
                            @endif
                        </div>
                        <div>
                            <h4 class="font-serif {{ $loop->iteration % 3 == 0 ? 'text-white' : 'text-brand-900' }} font-semibold">{{ $testimonial->client_name }}</h4>
                            <span class="text-xs {{ $loop->iteration % 3 == 0 ? 'text-brand-400' : 'text-gray-500' }} uppercase tracking-wider">{{ $testimonial->role }}</span>
                        </div>
                    </div>
                </div>
                @empty
                <!-- Review 1 -->
                <div class="bg-sand p-8 rounded-2xl border border-gray-100 relative group hover:shadow-xl transition duration-300" data-aos="fade-up" data-aos-delay="100">
                    <div class="text-brand-300 mb-4">
                        <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                    </div>
                    <p class="text-gray-600 mb-6 italic text-sm leading-relaxed">"Undangan website-nya sangat elegan dan cepat diakses! Tamu-tamu suka banget dengan fitur QR code buku tamunya, jadi gak ribet pas di resepsi. Sangat terbantu."</p>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Client" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h4 class="font-serif text-brand-900 font-semibold">Anisa & Dimas</h4>
                            <span class="text-xs text-gray-500 uppercase tracking-wider">Client Wedding</span>
                        </div>
                    </div>
                </div>

                <!-- Review 2 -->
                <div class="bg-sand p-8 rounded-2xl border border-gray-100 relative group hover:shadow-xl transition duration-300 transform md:-translate-y-4" data-aos="fade-up" data-aos-delay="200">
                    <div class="text-brand-300 mb-4">
                        <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                    </div>
                    <p class="text-gray-600 mb-6 italic text-sm leading-relaxed">"Pesan buku Yasin custom beserta souvenir tasbih di sini. Kualitas cetaknya luar biasa rapi, bahannya premium, dan pelayanannya super ramah. Recommended!"</p>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Client" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h4 class="font-serif text-brand-900 font-semibold">Keluarga Bpk. Haryono</h4>
                            <span class="text-xs text-gray-500 uppercase tracking-wider">Cetak Fisik & Souvenir</span>
                        </div>
                    </div>
                </div>

                <!-- Review 3 -->
                <div class="bg-brand-900 p-8 rounded-2xl border border-brand-800 relative group hover:shadow-2xl transition duration-300" data-aos="fade-up" data-aos-delay="300">
                    <div class="text-brand-600 mb-4">
                        <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                    </div>
                    <p class="text-gray-300 mb-6 italic text-sm leading-relaxed">"Tidak hanya jago bikin undangan, tim ini juga handle pembuatan aplikasi reservasi untuk bisnis F&B kami. UI/UX-nya sangat modern dan sistem berjalannya smooth."</p>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-brand-800 rounded-full overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" alt="Client" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h4 class="font-serif text-white font-semibold">Sarah Wijaya</h4>
                            <span class="text-xs text-brand-400 uppercase tracking-wider">Business Owner</span>
                        </div>
                    </div>
                </div>
                @endforelse
            </div>
        </div>
    </section>

@endsection