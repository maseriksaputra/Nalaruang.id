<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <link rel="icon" href="/logo1.png?v=2" type="image/png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nalaruang.id - Solusi Cetak, Undangan & Digital Kreatif</title>
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Alpine.js CDN -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
    <!-- AOS Animation CSS -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    
    <!-- Google Fonts: Playfair Display (Serif) & Plus Jakarta Sans (Sans) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <!-- Custom Tailwind Configuration -->
    <script>
        window.ASSET_URL = '{{ str_replace('test.txt', '', Storage::url('test.txt')) }}';
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        serif: ['"Playfair Display"', 'serif'],
                    },
                    colors: {
                        brand: {
                            900: '#7B065C', // Deep Dark Magenta for contrast
                            800: '#C40B93', // Logo Color 1
                            700: '#D81295', // Logo Color 2
                            600: '#F32396', // Logo Color 3
                            500: '#F63EA1', // Logo Color 5
                            100: '#FDF0F8', // Very light pink
                        },
                        sand: '#fdfbf7', // Off-white/warm
                    }
                }
            }
        }
    </script>

    <style>
        body { background-color: #fdfbf7; }
        
        /* Cinematic & Golden Hour Filters */
        .vintage-film {
            filter: contrast(1.1) saturate(1.2) sepia(0.2) hue-rotate(-5deg);
        }

        /* Overlay Gradasi */
        .hero-overlay {
            background: linear-gradient(to bottom, rgba(196,11,147,0.4) 0%, rgba(123,6,92,0.9) 100%);
        }
        .mid-overlay {
            background: rgba(123, 6, 92, 0.6);
        }
        
        /* Navbar Animasi */
        .nav-scrolled {
            background-color: rgba(255, 255, 255, 0.95) !important;
            box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.05);
            backdrop-filter: blur(8px);
        }
        
        /* Custom Letter Spacing */
        .tracking-widest-xl { letter-spacing: 0.3em; }

        /* Hover Animasi Katalog Layanan */
        .service-card {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .service-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 25px 30px -5px rgba(196, 11, 147, 0.25), 0 15px 15px -5px rgba(196, 11, 147, 0.1);
            border-color: transparent;
        }

        /* Animasi Hover Portofolio */
        .portfolio-item {
            overflow: hidden;
        }
        .portfolio-img {
            transition: transform 0.7s ease;
        }
        .portfolio-item:hover .portfolio-img {
            transform: scale(1.08);
        }
        .portfolio-overlay {
            background: linear-gradient(to top, rgba(123,6,92,0.95) 0%, rgba(123,6,92,0.3) 50%, transparent 100%);
            opacity: 1;
        }
        .portfolio-text {
            transform: translateY(0);
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
    </style>
</head>
<body class="font-sans text-gray-800 overflow-x-hidden selection:bg-brand-500 selection:text-white">

    <!-- Navbar -->
    <nav id="navbar" class="fixed w-full z-50 transition-all duration-300 bg-white/10 backdrop-blur-sm border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-20 items-center">
                <div class="flex-shrink-0 flex items-center">
                    <div class="flex items-center gap-2 group cursor-pointer" id="logo-container">
                        <img src="{{ asset('logo.png') }}" alt="Nalaruang.id" class="h-20 w-auto object-contain transform scale-150 origin-left transition duration-300" id="logo-img">
                    </div>
                </div>
                <div class="hidden lg:flex space-x-8 text-sm font-medium">
                    <a href="#beranda" class="text-white hover:text-brand-500 transition duration-300 nav-link">HOME</a>
                    <a href="#katalog" class="text-white hover:text-brand-500 transition duration-300 nav-link">LAYANAN</a>
                    <a href="#portofolio" class="text-white hover:text-brand-500 transition duration-300 nav-link">PORTOFOLIO</a>
                    <a href="#review" class="text-white hover:text-brand-500 transition duration-300 nav-link">CERITA KLIEN</a>
                </div>
                <div class="hidden md:flex items-center gap-6">

                    <a href="#kontak" id="nav-btn" class="bg-white/20 hover:bg-white hover:text-brand-900 backdrop-blur-sm text-white px-6 py-2.5 rounded-full text-sm font-medium transition duration-300 flex items-center gap-2 transform">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        Hubungi Kami
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section dengan Image Slideshow Geser Kanan-Kiri -->
    <section id="beranda" class="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-brand-900">
        <!-- Slideshow Container -->
        <div class="absolute inset-0 w-full h-full z-0 overflow-hidden">
            <div id="hero-slider-track" class="flex h-full w-full">
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
            </div>
            
            <div class="absolute inset-0 hero-overlay z-10 pointer-events-none"></div>
        </div>

        <!-- Teks Hero -->
        <div class="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16" data-aos="fade-up" data-aos-duration="1200">
            <p class="text-white/80 text-sm font-semibold tracking-widest mb-4 uppercase flex items-center justify-center gap-3">
                <span class="w-10 h-[1px] bg-white/50"></span> Best Choice <span class="w-10 h-[1px] bg-white/50"></span>
            </p>
            <h1 class="text-5xl md:text-7xl font-serif text-white mb-4 italic drop-shadow-lg">Web & Print Solution</h1>
            
            <h2 class="text-xl md:text-2xl text-white font-light tracking-[0.3em] uppercase mb-6 mt-8 drop-shadow-md">
                Creative & Digital Agency
            </h2>
            
            <p class="text-white/90 text-sm md:text-base mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                Platform percetakan estetik dan teknologi terintegrasi. Dari undangan cetak premium, merchandise custom, website pernikahan interaktif, hingga pengembangan aplikasi bisnis modern.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#katalog" class="inline-flex justify-center items-center gap-2 bg-brand-800/90 hover:bg-brand-600 backdrop-blur-sm text-white px-8 py-3.5 rounded-full text-sm font-medium transition duration-300 border border-white/10 hover:shadow-lg hover:shadow-brand-800/50">
                    Eksplorasi Layanan
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

    <section id="katalog" class="py-24 bg-white relative">
        <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(#C40B93 1px, transparent 1px); background-size: 32px 32px;"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="text-center mb-16" data-aos="fade-up">
                <p class="text-brand-600 text-sm font-semibold tracking-widest mb-3 uppercase">Layanan Lengkap Kami</p>
                <h2 class="text-3xl md:text-5xl font-serif text-brand-900 mb-6">Pilihan Katalog</h2>
                <div class="w-20 h-[1px] bg-brand-800 mx-auto"></div>
            </div>

            <!-- GRID KARTU LAYANAN -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <!-- Card 01 -->
                <div class="group relative bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col overflow-hidden h-full cursor-pointer" data-aos="fade-up" data-aos-delay="100">
                    <!-- Badge Number -->
                    <div class="absolute top-0 left-0 bg-pink-500 text-white text-xs font-bold px-4 py-2 rounded-br-2xl z-20 shadow-sm">01</div>
                    
                    
                    <!-- Dot Pattern -->
                    <div class="absolute top-6 right-6 w-24 h-24 opacity-50 z-0" style="background-image: radial-gradient(#f9a8d4 2.5px, transparent 2.5px); background-size: 12px 12px;"></div>
                    
                    <!-- Gradient Blobs for dynamic background -->
                    <div class="absolute inset-0 bg-pink-200 mix-blend-multiply filter blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
                    <div class="absolute -bottom-10 -right-10 w-full h-full bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-700 delay-100"></div>

                    <!-- Multi-layer Wave Background -->
                    <svg class="absolute bottom-0 left-0 w-full opacity-60 group-hover:opacity-100 transition-opacity duration-700 z-0 transform translate-y-2 group-hover:translate-y-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path class="text-pink-100" fill="currentColor" fill-opacity="0.5" d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,149.3C672,139,768,149,864,165.3C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        <path class="text-pink-200" fill="currentColor" fill-opacity="0.4" d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,234.7C672,235,768,213,864,197.3C960,181,1056,149,1152,144C1248,139,1344,160,1392,170.7L1440,181L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        <path class="text-pink-300" fill="currentColor" fill-opacity="0.3" d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,229.3C672,224,768,192,864,186.7C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>

                    <!-- Premium 2.5D Icon (Centered) -->
                    <div class="relative w-24 h-24 mx-auto mt-8 mb-6 z-10 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 flex items-center justify-center">
                        <div class="absolute inset-0 bg-gradient-to-br from-pink-100 to-white rounded-full shadow-inner opacity-90 group-hover:rotate-12 transition-transform duration-700"></div>
                        <div class="absolute inset-2 bg-gradient-to-tl from-pink-50 to-white rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.05)]"></div>
                        <div class="absolute inset-0 bg-pink-400 opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-opacity duration-500"></div>
                        <svg class="w-10 h-10 text-pink-600 filter drop-shadow-md relative z-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    </div>

                    <!-- Content -->
                    <div class="relative z-10 flex-grow flex flex-col">
                        <h3 class="text-xl font-serif font-bold text-gray-900 mb-5 text-center group-hover:text-pink-800 transition-colors duration-300">Cetak Fisik Premium</h3>
                        
                        <ul class="text-gray-600 text-[13px] mb-8 space-y-3 flex-grow leading-relaxed text-left mx-auto w-fit">
                            <li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">Undangan Pernikahan Eksklusif</span></li><li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">Custom Lanyard & ID Card</span></li><li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">Buku Yasin & Majmu Premium</span></li><li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">Jasa Print & Fotocopy Dokumen</span></li>
                        </ul>

                        <div class="mt-auto text-center w-full">
                            <a href="/layanan/cetak-fisik-premium" class="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-100 text-pink-600 text-sm font-semibold rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-500 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 w-full sm:w-auto">
                                Detail Layanan <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>
                <!-- Card 02 -->
                <div class="group relative bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col overflow-hidden h-full cursor-pointer" data-aos="fade-up" data-aos-delay="200">
                    <!-- Badge Number -->
                    <div class="absolute top-0 left-0 bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-br-2xl z-20 shadow-sm">02</div>
                    <div class="absolute top-0 right-0 bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-3 py-1.5 rounded-bl-xl z-20 flex items-center gap-1 shadow-sm"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> TERPOPULER</div>
                    
                    <!-- Dot Pattern -->
                    <div class="absolute top-6 right-6 w-24 h-24 opacity-50 z-0" style="background-image: radial-gradient(#93c5fd 2.5px, transparent 2.5px); background-size: 12px 12px;"></div>
                    
                    <!-- Gradient Blobs for dynamic background -->
                    <div class="absolute inset-0 bg-blue-200 mix-blend-multiply filter blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
                    <div class="absolute -bottom-10 -right-10 w-full h-full bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-700 delay-100"></div>

                    <!-- Multi-layer Wave Background -->
                    <svg class="absolute bottom-0 left-0 w-full opacity-60 group-hover:opacity-100 transition-opacity duration-700 z-0 transform translate-y-2 group-hover:translate-y-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path class="text-blue-100" fill="currentColor" fill-opacity="0.5" d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,149.3C672,139,768,149,864,165.3C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        <path class="text-blue-200" fill="currentColor" fill-opacity="0.4" d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,234.7C672,235,768,213,864,197.3C960,181,1056,149,1152,144C1248,139,1344,160,1392,170.7L1440,181L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        <path class="text-blue-300" fill="currentColor" fill-opacity="0.3" d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,229.3C672,224,768,192,864,186.7C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>

                    <!-- Premium 2.5D Icon (Centered) -->
                    <div class="relative w-24 h-24 mx-auto mt-8 mb-6 z-10 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 flex items-center justify-center">
                        <div class="absolute inset-0 bg-gradient-to-br from-blue-100 to-white rounded-full shadow-inner opacity-90 group-hover:rotate-12 transition-transform duration-700"></div>
                        <div class="absolute inset-2 bg-gradient-to-tl from-blue-50 to-white rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.05)]"></div>
                        <div class="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-opacity duration-500"></div>
                        <svg class="w-10 h-10 text-blue-600 filter drop-shadow-md relative z-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                    </div>

                    <!-- Content -->
                    <div class="relative z-10 flex-grow flex flex-col">
                        <h3 class="text-xl font-serif font-bold text-gray-900 mb-5 text-center group-hover:text-blue-800 transition-colors duration-300">Event Digital</h3>
                        
                        <ul class="text-gray-600 text-[13px] mb-8 space-y-3 flex-grow leading-relaxed text-left mx-auto w-fit">
                            <li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">Website Undangan Interaktif</span></li><li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">Video Undangan Cinematic</span></li><li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">Buku Tamu Digital (QR Code)</span></li><li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">RSVP & Filter Instagram Acara</span></li>
                        </ul>

                        <div class="mt-auto text-center w-full">
                            <a href="/layanan/event-digital" class="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-100 text-blue-600 text-sm font-semibold rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 w-full sm:w-auto">
                                Detail Layanan <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>
                <!-- Card 03 -->
                <div class="group relative bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col overflow-hidden h-full cursor-pointer" data-aos="fade-up" data-aos-delay="300">
                    <!-- Badge Number -->
                    <div class="absolute top-0 left-0 bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-br-2xl z-20 shadow-sm">03</div>
                    
                    
                    <!-- Dot Pattern -->
                    <div class="absolute top-6 right-6 w-24 h-24 opacity-50 z-0" style="background-image: radial-gradient(#d8b4fe 2.5px, transparent 2.5px); background-size: 12px 12px;"></div>
                    
                    <!-- Gradient Blobs for dynamic background -->
                    <div class="absolute inset-0 bg-purple-200 mix-blend-multiply filter blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
                    <div class="absolute -bottom-10 -right-10 w-full h-full bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-700 delay-100"></div>

                    <!-- Multi-layer Wave Background -->
                    <svg class="absolute bottom-0 left-0 w-full opacity-60 group-hover:opacity-100 transition-opacity duration-700 z-0 transform translate-y-2 group-hover:translate-y-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path class="text-purple-100" fill="currentColor" fill-opacity="0.5" d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,149.3C672,139,768,149,864,165.3C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        <path class="text-purple-200" fill="currentColor" fill-opacity="0.4" d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,234.7C672,235,768,213,864,197.3C960,181,1056,149,1152,144C1248,139,1344,160,1392,170.7L1440,181L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        <path class="text-purple-300" fill="currentColor" fill-opacity="0.3" d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,229.3C672,224,768,192,864,186.7C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>

                    <!-- Premium 2.5D Icon (Centered) -->
                    <div class="relative w-24 h-24 mx-auto mt-8 mb-6 z-10 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 flex items-center justify-center">
                        <div class="absolute inset-0 bg-gradient-to-br from-purple-100 to-white rounded-full shadow-inner opacity-90 group-hover:rotate-12 transition-transform duration-700"></div>
                        <div class="absolute inset-2 bg-gradient-to-tl from-purple-50 to-white rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.05)]"></div>
                        <div class="absolute inset-0 bg-purple-400 opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-opacity duration-500"></div>
                        <svg class="w-10 h-10 text-purple-600 filter drop-shadow-md relative z-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
                    </div>

                    <!-- Content -->
                    <div class="relative z-10 flex-grow flex flex-col">
                        <h3 class="text-xl font-serif font-bold text-gray-900 mb-5 text-center group-hover:text-purple-800 transition-colors duration-300">Souvenir & Merchandise</h3>
                        
                        <ul class="text-gray-600 text-[13px] mb-8 space-y-3 flex-grow leading-relaxed text-left mx-auto w-fit">
                            <li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">Tumbler & Gelas Kaca Custom</span></li><li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">Tasbih Premium & Box Estetik</span></li><li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">Totebag Canvas Sablon</span></li><li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">Plakat Akrilik & Kayu</span></li>
                        </ul>

                        <div class="mt-auto text-center w-full">
                            <a href="/layanan/souvenir-merchandise" class="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-100 text-purple-600 text-sm font-semibold rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 w-full sm:w-auto">
                                Detail Layanan <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>
                <!-- Card 04 -->
                <div class="group relative bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col overflow-hidden h-full cursor-pointer" data-aos="fade-up" data-aos-delay="400">
                    <!-- Badge Number -->
                    <div class="absolute top-0 left-0 bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-br-2xl z-20 shadow-sm">04</div>
                    
                    
                    <!-- Dot Pattern -->
                    <div class="absolute top-6 right-6 w-24 h-24 opacity-50 z-0" style="background-image: radial-gradient(#6ee7b7 2.5px, transparent 2.5px); background-size: 12px 12px;"></div>
                    
                    <!-- Gradient Blobs for dynamic background -->
                    <div class="absolute inset-0 bg-emerald-200 mix-blend-multiply filter blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
                    <div class="absolute -bottom-10 -right-10 w-full h-full bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-700 delay-100"></div>

                    <!-- Multi-layer Wave Background -->
                    <svg class="absolute bottom-0 left-0 w-full opacity-60 group-hover:opacity-100 transition-opacity duration-700 z-0 transform translate-y-2 group-hover:translate-y-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path class="text-emerald-100" fill="currentColor" fill-opacity="0.5" d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,149.3C672,139,768,149,864,165.3C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        <path class="text-emerald-200" fill="currentColor" fill-opacity="0.4" d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,234.7C672,235,768,213,864,197.3C960,181,1056,149,1152,144C1248,139,1344,160,1392,170.7L1440,181L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        <path class="text-emerald-300" fill="currentColor" fill-opacity="0.3" d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,229.3C672,224,768,192,864,186.7C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>

                    <!-- Premium 2.5D Icon (Centered) -->
                    <div class="relative w-24 h-24 mx-auto mt-8 mb-6 z-10 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 flex items-center justify-center">
                        <div class="absolute inset-0 bg-gradient-to-br from-emerald-100 to-white rounded-full shadow-inner opacity-90 group-hover:rotate-12 transition-transform duration-700"></div>
                        <div class="absolute inset-2 bg-gradient-to-tl from-emerald-50 to-white rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.05)]"></div>
                        <div class="absolute inset-0 bg-emerald-400 opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-opacity duration-500"></div>
                        <svg class="w-10 h-10 text-emerald-600 filter drop-shadow-md relative z-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                    </div>

                    <!-- Content -->
                    <div class="relative z-10 flex-grow flex flex-col">
                        <h3 class="text-xl font-serif font-bold text-gray-900 mb-5 text-center group-hover:text-emerald-800 transition-colors duration-300">Web & Mobile App</h3>
                        
                        <ul class="text-gray-600 text-[13px] mb-8 space-y-3 flex-grow leading-relaxed text-left mx-auto w-fit">
                            <li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">UI/UX Design & Prototyping</span></li><li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">Landing Page & Company Profile</span></li><li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">Aplikasi Bisnis / Kasir Mobile</span></li><li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">Sistem Reservasi Custom</span></li>
                        </ul>

                        <div class="mt-auto text-center w-full">
                            <a href="/layanan/web-mobile-app" class="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-100 text-emerald-600 text-sm font-semibold rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 w-full sm:w-auto">
                                Detail Layanan <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>
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
                <div class="mb-16 last:mb-0" data-aos="fade-up">
                    <div class="flex flex-col md:flex-row justify-between items-center md:items-end mb-6 text-center md:text-left">
                        <div class="mb-4 md:mb-0">
                            <h3 class="text-2xl font-serif text-brand-900 mb-1">{{ $service->title }}</h3>
                            <p class="text-sm text-brand-600">{{ $service->templates->count() }} Produk Tersedia</p>
                        </div>
                        <a href="{{ $service->slug ? route('service.show', $service->slug) : '#' }}" class="mt-4 md:mt-0 text-brand-600 hover:text-brand-800 text-sm font-semibold inline-flex items-center group transition-colors">
                            Lihat Selengkapnya 
                            <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </a>
                    </div>
                    
                    @if($service->templates->count() > 0)
                    <!-- Horizontal Slider Container -->
                    <div x-data="{ 
                            canScrollLeft: false, 
                            canScrollRight: true, 
                            scrollLeft() { this.$refs.slider.scrollBy({ left: -260, behavior: 'smooth' }) }, 
                            scrollRight() { this.$refs.slider.scrollBy({ left: 260, behavior: 'smooth' }) }, 
                            checkScroll() { 
                                this.canScrollLeft = this.$refs.slider.scrollLeft > 0; 
                                this.canScrollRight = this.$refs.slider.scrollLeft < (this.$refs.slider.scrollWidth - this.$refs.slider.clientWidth - 5); 
                            } 
                        }" 
                        x-init="$nextTick(() => checkScroll())"
                        class="relative group/slider">
                        
                        <!-- Arrow Kiri -->
                        <button x-show="canScrollLeft" @click="scrollLeft()" class="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] text-brand-900 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-brand-50 hover:scale-110 disabled:opacity-0" style="display: none;">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>

                        <!-- Arrow Kanan -->
                        <button x-show="canScrollRight" @click="scrollRight()" class="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] text-brand-900 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-brand-50 hover:scale-110 disabled:opacity-0" style="display: none;">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>

                        <div x-ref="slider" @scroll.passive="checkScroll" class="flex overflow-x-auto hide-scrollbar gap-2 sm:gap-4 md:gap-5 snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 relative scroll-smooth">
                            @foreach($service->templates as $template)
                            @php
                                $allImages = array_values(array_filter(array_merge([$template->image], (array)$template->images)));
                                if (empty($allImages)) {
                                    $allImages = [''];
                                }
                            @endphp
                            <div x-data="{ 
                                    currentSlide: 0, 
                                    slides: {{ json_encode($allImages) }}, 
                                    get extendedSlides() { return this.slides.length > 1 ? [...this.slides, this.slides[0]] : this.slides; },
                                    next() {
                                        if (this.currentSlide >= this.slides.length || !this.$refs.slideTrack) return;
                                        const track = this.$refs.slideTrack;
                                        track.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
                                        this.currentSlide++;
                                        track.style.transform = `translateX(-${this.currentSlide * 100}%)`;

                                        if (this.currentSlide === this.slides.length) {
                                            setTimeout(() => {
                                                track.style.transition = 'none';
                                                this.currentSlide = 0;
                                                track.style.transform = `translateX(0%)`;
                                                void track.offsetWidth;
                                            }, 700);
                                        }
                                    },
                                    prev() {
                                        if (!this.$refs.slideTrack) return;
                                        const track = this.$refs.slideTrack;
                                        if (this.currentSlide === 0) {
                                            track.style.transition = 'none';
                                            this.currentSlide = this.slides.length;
                                            track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
                                            void track.offsetWidth;
                                            
                                            setTimeout(() => {
                                                track.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
                                                this.currentSlide--;
                                                track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
                                            }, 50);
                                        } else {
                                            track.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
                                            this.currentSlide--;
                                            track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
                                        }
                                    },
                                    init() { 
                                        if (this.slides.length > 1) { 
                                            setInterval(() => { this.next() }, 4000) 
                                        } 
                                     } 
                                 }" 
                                 class="portfolio-item snap-start shrink-0 w-[calc(50%-4px)] sm:w-[200px] md:w-[220px] group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden" 
                                 data-aos="zoom-in" data-aos-delay="{{ $loop->iteration * 50 }}">
                                 
                                <div class="relative w-full bg-sand group-hover:opacity-95 transition-opacity overflow-hidden aspect-[4/5]">
                                    
                                    @php
                                        $validImages = array_filter($allImages);
                                        $iframeUrl = $template->preview_url;
                                        if ($iframeUrl && !str_contains($iframeUrl, 'preview=')) {
                                            $iframeUrl .= (str_contains($iframeUrl, '?') ? '&' : '?') . 'preview=1';
                                        }
                                    @endphp
                                    
                                    @if(empty($validImages) && $iframeUrl)
                                        <!-- Iframe Preview Fallback -->
                                        <div class="absolute inset-0 w-full h-full bg-gray-100 overflow-hidden pointer-events-none">
                                            <div style="width: 414px; height: 896px; transform: scale(0.58); transform-origin: top left;">
                                                <iframe src="{{ $iframeUrl }}" class="w-full h-full border-0" tabindex="-1" loading="lazy"></iframe>
                                            </div>
                                        </div>
                                    @else
                                        <div x-ref="slideTrack" class="absolute inset-0 w-full h-full flex" style="transform: translateX(0%); transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)">
                                            <template x-for="(slide, index) in extendedSlides" :key="index">
                                                <img x-bind:src="slide ? (slide.startsWith('http') ? slide : window.ASSET_URL + slide) : 'https://placehold.co/600x800/eef2f0/2A4035?text=Preview+Desain'" 
                                                     class="portfolio-img w-full h-full object-cover shrink-0" 
                                                     alt="{{ $template->name }}" 
                                                     onerror="this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000'">
                                            </template>
                                        </div>
                                    @endif
                                    
                                    <!-- Slider Controls untuk Gambar -->
                                    <div x-show="slides.length > 1" class="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        <button @click.prevent="prev()" class="w-6 h-6 rounded-full bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center shadow transition-colors">
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                                        </button>
                                        <button @click.prevent="next()" class="w-6 h-6 rounded-full bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center shadow transition-colors">
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                                        </button>
                                    </div>

                                    <!-- Overlay -->
                                    <div class="absolute inset-0 bg-brand-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-2 z-10 pointer-events-none">
                                        <div class="pointer-events-auto flex flex-col gap-2 w-full px-4 md:px-6">
                                            @if(isset($template->service) && $template->service->slug == 'event-digital')
                                            <a href="{{ $template->preview_url ?? '#' }}" 
                                               @if(empty($template->preview_url)) onclick="event.preventDefault(); alert('Demo belum tersedia untuk produk ini.');" @else target="_blank" @endif
                                               class="w-full py-1.5 md:py-2 bg-white/20 hover:bg-white text-white hover:text-brand-900 rounded-full text-[10px] md:text-xs font-medium transition backdrop-blur-sm text-center">
                                                Lihat Demo
                                            </a>
                                            @else
                                            <button @click.prevent.stop="$dispatch('open-lightbox', { images: slides })" 
                                               class="w-full py-1.5 md:py-2 bg-white/20 hover:bg-white text-white hover:text-brand-900 rounded-full text-[10px] md:text-xs font-medium transition backdrop-blur-sm text-center">
                                                Lihat Gambar
                                            </button>
                                            @endif
                                            <a href="{{ route('product.show', $template->id) }}" class="w-full py-1.5 md:py-2 bg-brand-500 hover:bg-brand-400 text-white rounded-full text-[10px] md:text-xs font-bold transition shadow-lg text-center">
                                                Detail Produk
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="p-3 md:p-5 flex flex-col flex-grow">
                                    <div class="flex flex-col justify-start mb-2 gap-1">
                                        <h3 class="text-sm md:text-lg font-serif text-brand-900 group-hover:text-brand-600 transition line-clamp-2 md:line-clamp-1 leading-snug" title="{{ $template->name }}">{{ $template->name }}</h3>
                                        <span class="bg-brand-50 text-brand-600 text-[8px] md:text-[10px] font-bold uppercase px-2 py-0.5 rounded whitespace-nowrap self-start">{{ $template->category ?? 'Produk Premium' }}</span>
                                    </div>
                                    <div class="mt-auto pt-2 flex flex-col">
                                        @if($template->discount_price && $template->discount_price < $template->price)
                                            <div class="text-gray-400 text-[10px] md:text-xs line-through mb-0.5">
                                                Rp {{ number_format($template->price, 0, ',', '.') }}
                                            </div>
                                            <div class="text-brand-600 font-bold text-sm md:text-base">
                                                Rp {{ number_format($template->discount_price, 0, ',', '.') }}
                                            </div>
                                        @else
                                            <div class="text-brand-600 font-bold text-sm md:text-base">
                                                Rp {{ number_format($template->price, 0, ',', '.') }}
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            </div>
                            @endforeach
                        </div>
                    </div>
                    @else
                    <div class="bg-white/50 rounded-xl p-8 text-center border border-brand-200 border-dashed">
                        <p class="text-gray-500 font-serif italic text-lg">Katalog produk untuk layanan ini sedang dalam persiapan.</p>
                        <p class="text-sm text-gray-400 mt-2">Silakan hubungi tim kami untuk informasi lebih lanjut.</p>
                    </div>
                    @endif
                </div>
            @endforeach
        </div>
    </section>

    <!-- Portofolio Section -->
    @if($portfolios->count() > 0)
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
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                @foreach($portfolios as $portfolio)
                <div class="portfolio-item rounded-xl relative group block overflow-hidden" 
                     style="aspect-ratio: 1/1;"
                     data-aos="zoom-in" data-aos-delay="{{ $loop->iteration * 100 }}">
                    
                    <img src="{{ $portfolio->image ? Storage::url($portfolio->image) : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000' }}" 
                         class="portfolio-img absolute inset-0 w-full h-full object-cover" 
                         alt="{{ $portfolio->title }}">
                         
                    <div class="portfolio-overlay absolute inset-0 flex flex-col justify-end p-6 pointer-events-none">
                        <div class="portfolio-text pointer-events-auto">
                            <span class="text-brand-100 hover:text-white text-xs font-bold tracking-wider uppercase mb-1 block transition">{{ $portfolio->category ?? 'Karya' }}</span>
                            <h3 class="text-lg font-serif text-white">{{ $portfolio->title }}</h3>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </section>
    @endif

    <!-- Mid Banner Section -->
    <section class="relative py-32 mt-10">
        <div class="absolute inset-0 w-full h-full bg-fixed" style="background-image: url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1920'); background-size: cover; background-position: center;">
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
            </div>
        </div>
    </section>

    <!-- Floating Help Button -->
    <div class="fixed bottom-6 right-6 z-50 flex items-end gap-3">
        <div class="bg-brand-600 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg shadow-brand-900/20 mb-1 hidden md:block animate-bounce">
            Punya pertanyaan ?<br><span class="font-bold">Cek Help Center</span>
        </div>
        <a href="https://wa.me/6285196811112?text=Halo%20Tim%20Nalaruang,%20saya%20ingin%20bertanya%20terkait%20layanan%20Anda." target="_blank" class="bg-brand-600 hover:bg-brand-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition transform hover:scale-110">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </a>
    </div>

    <!-- Footer -->
    <footer id="kontak" class="bg-brand-900 text-gray-300 py-16 border-t-[6px] border-brand-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div class="md:col-span-2">
                <div class="flex items-center gap-2 mb-6">
                    <img src="{{ asset('logo.png') }}" alt="Nalaruang.id" class="h-28 w-auto object-contain transform scale-125 origin-left">
                </div>
                <p class="text-sm text-gray-400 leading-relaxed max-w-sm">
                    Platform integrasi cetak fisik premium, souvenir, undangan digital website estetik, hingga pengembangan aplikasi bisnis terpercaya.
                </p>
            </div>
            <div>
                <h4 class="text-white font-serif text-lg mb-6 tracking-wide">Navigasi</h4>
                <ul class="space-y-3 text-sm">
                    <li><a href="#katalog" class="hover:text-white transition flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Katalog Cetak & Souvenir</a></li>
                    <li><a href="#katalog" class="hover:text-white transition flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Undangan Website</a></li>
                    <li><a href="#katalog" class="hover:text-white transition flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Jasa Web & App Design</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-white font-serif text-lg mb-6 tracking-wide">Hubungi Kami</h4>
                <ul class="space-y-3 text-sm text-gray-400">
                    <li class="flex items-center gap-3">
                        <svg class="w-4 h-4 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        <a href="https://wa.me/6285196811112?text=Halo%20Tim%20Nalaruang,%20saya%20ingin%20bertanya%20terkait%20layanan%20Anda." target="_blank" class="hover:text-white transition">+62 851-9681-1112</a>
                    </li>
                    <li class="flex items-center gap-3">
                        <svg class="w-4 h-4 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        <a href="mailto:nalarruang.id@gmail.com" class="hover:text-white transition">nalarruang.id@gmail.com</a>
                    </li>
                    <li class="flex items-center gap-3">
                        <svg class="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Purwodadi, Jawa Tengah
                    </li>
                </ul>
            </div>
        </div>
        <div class="border-t border-brand-800/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-brand-500">
            <p>&copy; 2026 Nalaruang.id. Dibuat dengan sepenuh hati.</p>
            <div class="flex gap-4 mt-4 md:mt-0">
                <a href="https://www.instagram.com/nalaruang.id?igsh=cXZpNHczdG5rc202" target="_blank" class="hover:text-white transition">Instagram</a>
                <a href="https://www.tiktok.com/@nalaruang.id?_r=1&_t=ZS-97N9GajetqG" target="_blank" class="hover:text-white transition">TikTok</a>
                <a href="https://wa.me/6285196811112?text=Halo%20Tim%20Nalaruang,%20saya%20ingin%20bertanya%20terkait%20layanan%20Anda." target="_blank" class="hover:text-white transition">WhatsApp</a>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        // Init Animasi AOS
        AOS.init({
            once: true,
            offset: 50,
            duration: 800,
            easing: 'ease-out-cubic',
        });

        // Script Navbar Scroll yang Diperbarui
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            const links = document.querySelectorAll('.nav-link');
            const logoText = document.getElementById('logo-text');
            const logoBox = document.getElementById('logo-box');
            const navBtn = document.getElementById('nav-btn');
            
            if (window.scrollY > 50) {
                // Saat Dis-scroll
                navbar.classList.add('nav-scrolled');
                navbar.classList.remove('bg-white/10', 'border-b', 'border-white/10');
                
                links.forEach(link => {
                    link.classList.remove('text-white');
                    link.classList.add('text-gray-700');
                });
                
                
                // Ubah Tombol
                if (navBtn) {
                    navBtn.classList.remove('bg-white/20', 'text-white', 'hover:bg-white', 'hover:text-brand-900');
                    navBtn.classList.add('bg-brand-800', 'text-white', 'hover:bg-brand-700');
                }
                
            } else {
                // Posisi Paling Atas (Transparan)
                navbar.classList.remove('nav-scrolled');
                navbar.classList.add('bg-white/10', 'border-b', 'border-white/10');
                
                links.forEach(link => {
                    link.classList.add('text-white');
                    link.classList.remove('text-gray-700');
                });
                
                
                // Kembalikan Tombol
                if (navBtn) {
                    navBtn.classList.add('bg-white/20', 'text-white', 'hover:bg-white', 'hover:text-brand-900');
                    navBtn.classList.remove('bg-brand-800', 'hover:bg-brand-700');
                }
            }
        });

        // Script untuk Animasi Slideshow Horizontal (Kanan ke Kiri)
        document.addEventListener('DOMContentLoaded', function() {
            const track = document.getElementById('hero-slider-track');
            
            function nextSlide() {
                // Tambahkan transisi animasi geser
                track.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
                track.style.transform = `translateX(-100%)`;

                // Setelah animasi selesai (1000ms), pindahkan gambar pertama ke antrean paling belakang
                setTimeout(() => {
                    track.style.transition = 'none'; // Matikan transisi sementara
                    if (track.firstElementChild) {
                        track.appendChild(track.firstElementChild); // Pindah div gambar pertama ke akhir
                    }
                    track.style.transform = 'translateX(0)'; // Reset posisi ke awal
                    void track.offsetWidth; // Force layout flush
                }, 1000); 
            }

            // Ganti gambar setiap 5 detik
            setInterval(nextSlide, 5000);
        });
    </script>
@include('components.lightbox')
</body>

