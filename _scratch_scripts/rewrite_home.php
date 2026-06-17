<?php
$html = file_get_contents('resources/views/home.blade.php');

// Replace Hero Slides
$heroRegex = '/<div id="hero-slider-track".*?>(.*?)<\/div>/s';
$heroReplacement = '<div id="hero-slider-track" class="flex h-full w-full">
                @if($heroSlides->count() > 0)
                    @foreach($heroSlides as $slide)
                        <img src="{{ Storage::url($slide->image) }}" alt="{{ $slide->title }}" class="flex-none w-full h-full object-cover object-center vintage-film bg-brand-800">
                    @endforeach
                @else
                    <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1920" alt="Pernikahan" class="flex-none w-full h-full object-cover object-center vintage-film bg-brand-800">
                    <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1920" alt="Cincin Kawin" class="flex-none w-full h-full object-cover object-center vintage-film bg-brand-800">
                    <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1920" alt="Digital Printing" class="flex-none w-full h-full object-cover object-center vintage-film bg-brand-800">
                    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1920" alt="Web Development IT" class="flex-none w-full h-full object-cover object-center vintage-film bg-brand-800">
                    <img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=1920" alt="Souvenir Acara" class="flex-none w-full h-full object-cover object-center vintage-film bg-brand-800">
                @endif
            </div>';
$html = preg_replace($heroRegex, $heroReplacement, $html);

// Replace Services
$servicesRegex = '/<!-- GRID KARTU LAYANAN -->.*?<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">(.*?)<\/div>.*?<\/section>/s';
$servicesReplacement = '<!-- GRID KARTU LAYANAN -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                @forelse($services as $service)
                <div class="service-card bg-sand hover:bg-brand-900 p-8 rounded-xl border border-gray-100 group flex flex-col relative overflow-hidden cursor-pointer" data-aos="fade-up" data-aos-delay="{{ $loop->iteration * 100 }}">
                    @if($service->is_popular)
                    <div class="absolute top-0 right-0 bg-brand-800 text-white group-hover:bg-white group-hover:text-brand-900 transition-colors duration-500 text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg">Terpopuler</div>
                    @endif
                    <div class="w-14 h-14 bg-brand-100 group-hover:bg-brand-800 rounded-full flex items-center justify-center mb-6 text-brand-800 group-hover:text-white transition-colors duration-500 transform group-hover:scale-110">
                        {!! $service->icon ?? \'<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>\' !!}
                    </div>
                    <h3 class="text-xl font-serif text-brand-900 group-hover:text-white transition-colors duration-500 mb-4">{{ $service->title }}</h3>
                    <ul class="text-gray-600 group-hover:text-brand-100 transition-colors duration-500 text-sm mb-8 space-y-3 flex-grow">
                        @if(is_array($service->features))
                            @foreach($service->features as $feature)
                            <li class="flex items-start"><span class="text-brand-500 group-hover:text-brand-400 transition-colors duration-500 mr-2">✦</span> {{ $feature }}</li>
                            @endforeach
                        @endif
                    </ul>
                    <a href="#" class="inline-flex items-center text-brand-800 group-hover:text-white text-sm font-semibold transition-colors duration-500">
                        Detail Layanan <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </a>
                </div>
                @empty
                    <p class="col-span-full text-center text-gray-500">Katalog layanan akan segera hadir.</p>
                @endforelse
            </div>
        </div>
    </section>';
$html = preg_replace($servicesRegex, $servicesReplacement, $html);

// Replace Portfolio
$portfolioRegex = '/<!-- Portfolio Grid -->.*?<div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">(.*?)<\/div>.*?<\/section>/s';
$portfolioReplacement = '<!-- Portfolio Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                @forelse($portfolios as $portfolio)
                <div class="portfolio-item rounded-xl relative aspect-square {{ $loop->iteration % 4 == 1 || $loop->iteration % 4 == 0 ? \'md:col-span-2\' : \'\' }} group" data-aos="zoom-in" data-aos-delay="{{ $loop->iteration * 100 }}">
                    <img src="{{ Storage::url($portfolio->image) }}" class="portfolio-img w-full h-full object-cover {{ $loop->iteration % 2 == 0 ? \'vintage-film\' : \'\' }}" alt="{{ $portfolio->title }}">
                    <div class="portfolio-overlay absolute inset-0 flex flex-col justify-end p-8">
                        <div class="portfolio-text">
                            <span class="text-brand-100 text-xs font-bold tracking-wider uppercase mb-2 block">{{ $portfolio->category }}</span>
                            <h3 class="text-2xl font-serif text-white">{{ $portfolio->title }}</h3>
                        </div>
                    </div>
                </div>
                @empty
                    <p class="col-span-full text-center text-gray-500">Portofolio belum tersedia.</p>
                @endforelse
            </div>
        </div>
    </section>';
$html = preg_replace($portfolioRegex, $portfolioReplacement, $html);

// Replace Testimonials
$testimonialsRegex = '/<div class="grid grid-cols-1 md:grid-cols-3 gap-8">(.*?)<\/div>.*?<\/section>/s';
$testimonialsReplacement = '<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                @forelse($testimonials as $testimonial)
                <div class="{{ $loop->iteration % 2 == 0 ? \'bg-sand p-8 rounded-2xl border border-gray-100 relative group hover:shadow-xl transition duration-300 transform md:-translate-y-4\' : ($loop->iteration % 3 == 0 ? \'bg-brand-900 p-8 rounded-2xl border border-brand-800 relative group hover:shadow-2xl transition duration-300\' : \'bg-sand p-8 rounded-2xl border border-gray-100 relative group hover:shadow-xl transition duration-300\') }}" data-aos="fade-up" data-aos-delay="{{ $loop->iteration * 100 }}">
                    <div class="{{ $loop->iteration % 3 == 0 ? \'text-brand-600\' : \'text-brand-300\' }} mb-4">
                        <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                    </div>
                    <p class="{{ $loop->iteration % 3 == 0 ? \'text-gray-300\' : \'text-gray-600\' }} mb-6 italic text-sm leading-relaxed">"{{ $testimonial->content }}"</p>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 {{ $loop->iteration % 3 == 0 ? \'bg-brand-800\' : \'bg-gray-200\' }} rounded-full overflow-hidden">
                            @if($testimonial->avatar)
                                <img src="{{ Storage::url($testimonial->avatar) }}" alt="{{ $testimonial->client_name }}" class="w-full h-full object-cover">
                            @else
                                <div class="w-full h-full flex items-center justify-center font-bold text-gray-500">{{ substr($testimonial->client_name, 0, 1) }}</div>
                            @endif
                        </div>
                        <div>
                            <h4 class="font-serif {{ $loop->iteration % 3 == 0 ? \'text-white\' : \'text-brand-900\' }} font-semibold">{{ $testimonial->client_name }}</h4>
                            <span class="text-xs {{ $loop->iteration % 3 == 0 ? \'text-brand-400\' : \'text-gray-500\' }} uppercase tracking-wider">{{ $testimonial->role }}</span>
                        </div>
                    </div>
                </div>
                @empty
                    <p class="col-span-full text-center text-gray-500">Belum ada cerita klien.</p>
                @endforelse
            </div>
        </div>
    </section>';
$html = preg_replace($testimonialsRegex, $testimonialsReplacement, $html);

file_put_contents('resources/views/home.blade.php', $html);
echo "Blade template home.blade.php updated with dynamic loops.";
