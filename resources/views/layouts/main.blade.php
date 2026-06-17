<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <link rel="icon" href="/logo1.png" type="image/png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nalaruang.id - Solusi Cetak, Undangan & Digital Kreatif</title>
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- AOS Animation CSS -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    
    <!-- Alpine JS -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
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
            background: linear-gradient(to top, rgba(123,6,92,0.9) 0%, transparent 100%);
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        .portfolio-item:hover .portfolio-overlay {
            opacity: 1;
        }
        .portfolio-text {
            transform: translateY(20px);
            transition: transform 0.4s ease;
        }
        .portfolio-item:hover .portfolio-text {
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
                    <a href="{{ url('/') }}" class="flex items-center gap-2 group cursor-pointer" id="logo-container">
                        <img src="{{ asset('logo.png') }}" alt="Nalaruang.id" class="h-20 w-auto object-contain transform scale-150 origin-left transition duration-300" id="logo-img">
                    </a>
                </div>
                <div class="hidden lg:flex space-x-8 text-sm font-medium">
                    <a href="{{ request()->is('/') ? '#beranda' : url('/#beranda') }}" class="text-white hover:text-brand-500 transition duration-300 nav-link">HOME</a>
                    <a href="{{ request()->is('/') ? '#katalog' : url('/#katalog') }}" class="text-white hover:text-brand-500 transition duration-300 nav-link">LAYANAN</a>
                    <a href="{{ request()->is('/') ? '#portofolio' : url('/#portofolio') }}" class="text-white hover:text-brand-500 transition duration-300 nav-link">PORTOFOLIO</a>
                    <a href="{{ request()->is('/') ? '#review' : url('/#review') }}" class="text-white hover:text-brand-500 transition duration-300 nav-link">CERITA KLIEN</a>
                </div>
                <div class="hidden md:block">
                    <a href="{{ request()->is('/') ? '#kontak' : url('/#kontak') }}" id="nav-btn" class="bg-white/20 hover:bg-white hover:text-brand-900 backdrop-blur-sm text-white px-6 py-2.5 rounded-full text-sm font-medium transition duration-300 flex items-center gap-2 transform">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        Hubungi Kami
                    </a>
                </div>
            </div>
        </div>
    </nav>

        @yield('content')

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
    <footer class="bg-brand-900 text-gray-300 py-16 border-t-[6px] border-brand-800" id="kontak">
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
                    <li><a href="{{ request()->is('/') ? '#katalog' : url('/#katalog') }}" class="hover:text-white transition flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Katalog Cetak & Souvenir</a></li>
                    <li><a href="{{ request()->is('/') ? '#katalog' : url('/#katalog') }}" class="hover:text-white transition flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Undangan Website</a></li>
                    <li><a href="{{ request()->is('/') ? '#katalog' : url('/#katalog') }}" class="hover:text-white transition flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Jasa Web & App Design</a></li>
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
                <a href="#" class="hover:text-white transition">Instagram</a>
                <a href="#" class="hover:text-white transition">TikTok</a>
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
            
            if (window.scrollY > 50 || !{{ request()->is('/') ? 'true' : 'false' }}) {
                // Saat Dis-scroll atau saat BUKAN di halaman utama
                navbar.classList.add('nav-scrolled');
                navbar.classList.remove('bg-white/10', 'border-b', 'border-white/10');
                
                links.forEach(link => {
                    link.classList.remove('text-white');
                    link.classList.add('text-gray-700');
                });
                
                
                
                // Ubah Tombol
                if(navBtn) {
                    navBtn.classList.remove('bg-white/20', 'text-white', 'hover:bg-white', 'hover:text-brand-900');
                    navBtn.classList.add('bg-brand-800', 'text-white', 'hover:bg-brand-700');
                }
                
            } else {
                // Posisi Paling Atas (Transparan) - Hanya Berlaku di Beranda
                navbar.classList.remove('nav-scrolled');
                navbar.classList.add('bg-white/10', 'border-b', 'border-white/10');
                
                links.forEach(link => {
                    link.classList.add('text-white');
                    link.classList.remove('text-gray-700');
                });
                
                
                
                // Kembalikan Tombol
                if(navBtn) {
                    navBtn.classList.add('bg-white/20', 'text-white', 'hover:bg-white', 'hover:text-brand-900');
                    navBtn.classList.remove('bg-brand-800', 'hover:bg-brand-700');
                }
            }
        });

        // Trigger scroll event once on load to ensure correct initial state (especially on sub-pages)
        window.dispatchEvent(new Event('scroll'));

        // Script untuk Animasi Slideshow Horizontal (Kanan ke Kiri)
        document.addEventListener('DOMContentLoaded', function() {
            const track = document.getElementById('hero-slider-track');
            
            if (!track) return;

            function nextSlide() {
                // Tambahkan transisi animasi geser
                track.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
                track.style.transform = `translateX(-100%)`;

                // Setelah animasi selesai (1000ms), pindahkan gambar pertama ke antrean paling belakang
                setTimeout(() => {
                    track.style.transition = 'none'; // Matikan transisi sementara
                    track.appendChild(track.firstElementChild); // Pindah div gambar pertama ke akhir
                    track.style.transform = 'translateX(0)'; // Reset posisi ke awal
                }, 1000); 
            }

            // Ganti gambar setiap 5 detik
            setInterval(nextSlide, 5000);
        });
    </script>
</body>
</html>
