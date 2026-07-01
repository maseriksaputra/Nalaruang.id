<!DOCTYPE html>
<html lang="id">
<head>
    <link rel="icon" href="/logo1.png?v=2" type="image/png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Client Area - {{ $invitation->title }}</title>
    @vite(['resources/css/app.css'])
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        [x-cloak] { display: none !important; }
        .glass-panel {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .stat-card {
            background: linear-gradient(135deg, #C40B93, #F63EA1);
            box-shadow: 0 8px 20px rgba(196, 11, 147, 0.25);
            color: white;
            transition: all 0.3s ease;
        }
        .dark .stat-card {
            background: linear-gradient(145deg, #1e293b, #0f172a);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 1px solid rgba(246, 62, 161, 0.2);
        }
        .stat-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 25px rgba(196, 11, 147, 0.35);
        }
        .dark .stat-card:hover {
            box-shadow: 0 0 20px rgba(246, 62, 161, 0.15);
            border-color: rgba(246, 62, 161, 0.4);
        }
        /* Custom scrollbar for wishes */
        .wishes-scroll::-webkit-scrollbar { width: 6px; }
        .wishes-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px;}
        .wishes-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px;}
    </style>
    <script>
        window.__INVITATION__ = @json($invitation);
        
        // SweetAlert2 Toast Configuration
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        // Global Delete Confirmation
        function confirmDelete(event, form) {
            event.preventDefault();
            Swal.fire({
                title: 'Yakin hapus tamu?',
                text: "Anda tidak dapat mengembalikan tindakan ini!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal',
                customClass: {
                    container: 'font-inter'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit();
                }
            });
        }

        // Animated Counter Function
        function animateValue(obj, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                // Easing out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                obj.innerHTML = Math.floor(easeOut * (end - start) + start);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    obj.innerHTML = end;
                }
            };
            window.requestAnimationFrame(step);
        }
    </script>
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 antialiased min-h-screen pb-24 lg:pb-0 transition-colors duration-300" x-data="{ darkMode: localStorage.getItem('darkMode') === 'true', activeTab: sessionStorage.getItem('activeTab') || 'dashboard', isMobileMenuOpen: false, qrModalOpen: false, qrUrl: '', qrName: '' }" x-init="$watch('activeTab', val => sessionStorage.setItem('activeTab', val)); $watch('darkMode', val => localStorage.setItem('darkMode', val)); if(darkMode) document.documentElement.classList.add('dark'); $watch('darkMode', val => val ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark'))">
    
    <!-- Navbar / Header -->
    <header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <img src="/logo1.png?v=2" alt="Logo Nalaruang" class="h-10 w-auto object-contain">
                <h1 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Client Area</h1>
            </div>
            


            <!-- Desktop Navigation -->
            <nav class="hidden lg:flex items-center gap-1">
                <button @click="activeTab = 'dashboard'" :class="{'bg-indigo-50 text-indigo-700 dark:text-indigo-400 dark:bg-indigo-900/40 dark:text-indigo-400': activeTab === 'dashboard', 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800': activeTab !== 'dashboard'}" class="px-4 py-2 rounded-lg text-sm font-semibold transition">Dasbor</button>
                <button @click="activeTab = 'tamu'" :class="{'bg-indigo-50 text-indigo-700 dark:text-indigo-400 dark:bg-indigo-900/40 dark:text-indigo-400': activeTab === 'tamu', 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800': activeTab !== 'tamu'}" class="px-4 py-2 rounded-lg text-sm font-semibold transition">Sebar Undangan</button>
                <button @click="activeTab = 'wishes'" :class="{'bg-indigo-50 text-indigo-700 dark:text-indigo-400 dark:bg-indigo-900/40 dark:text-indigo-400': activeTab === 'wishes', 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800': activeTab !== 'wishes'}" class="px-4 py-2 rounded-lg text-sm font-semibold transition">Buku Tamu</button>
                <!-- Dark Mode Toggle -->
                <button @click="darkMode = !darkMode" class="hidden sm:flex p-2 mr-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <svg x-show="!darkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                    <svg x-show="darkMode" x-cloak class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </button>
                <div class="w-px h-6 bg-slate-200 mx-2"></div>
                <a href="/{{ $invitation->slug }}" target="_blank" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition shadow-md flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    Lihat
                </a>
            </nav>

            <!-- Mobile Menu Toggle & Dark Mode -->
            <div class="flex items-center gap-1 lg:hidden">
                <button @click="darkMode = !darkMode" class="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <svg x-show="!darkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                    <svg x-show="darkMode" x-cloak class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </button>
                <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <svg x-show="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    <svg x-show="isMobileMenuOpen" x-cloak class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div x-show="isMobileMenuOpen" x-collapse x-cloak class="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div class="px-4 py-3 space-y-1">
                <button @click="activeTab = 'dashboard'; isMobileMenuOpen = false" :class="{'bg-indigo-50 text-indigo-700 dark:text-indigo-400 dark:bg-indigo-900/40 dark:text-indigo-400': activeTab === 'dashboard'}" class="w-full text-left px-4 py-3 rounded-lg font-semibold text-slate-700 dark:text-slate-300">Dasbor</button>
                <button @click="activeTab = 'tamu'; isMobileMenuOpen = false" :class="{'bg-indigo-50 text-indigo-700 dark:text-indigo-400 dark:bg-indigo-900/40 dark:text-indigo-400': activeTab === 'tamu'}" class="w-full text-left px-4 py-3 rounded-lg font-semibold text-slate-700 dark:text-slate-300">Sebar Undangan</button>
                <button @click="activeTab = 'wishes'; isMobileMenuOpen = false" :class="{'bg-indigo-50 text-indigo-700 dark:text-indigo-400 dark:bg-indigo-900/40 dark:text-indigo-400': activeTab === 'wishes'}" class="w-full text-left px-4 py-3 rounded-lg font-semibold text-slate-700 dark:text-slate-300">Buku Tamu</button>
                <div class="pt-2">
                    <a href="/{{ $invitation->slug }}" target="_blank" class="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold text-center block">Lihat Undangan</a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        <!-- Header Section -->
        <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{{ $invitation->title }}</h2>
                <p class="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span> Status: Aktif & Terpublikasi
                </p>
            </div>
            <div class="flex gap-2">
                <button @click="qrName = 'Undangan Utama'; qrUrl = '{{ url('/' . $invitation->slug) }}'; qrModalOpen = true;" class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800/60 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition shadow-sm hover:shadow">
                    <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                    QR Code Utama
                </button>
            </div>
        </div>

        <!-- TAB: DASHBOARD -->
        <div x-show="activeTab === 'dashboard'" x-transition.opacity.duration.300ms>
            
            <!-- Statistics Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <!-- Card: Pengunjung -->
                <div class="stat-card p-5 rounded-2xl relative overflow-hidden group">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/20 dark:bg-[#F63EA1]/10 rounded-full blur-xl group-hover:bg-white/30 dark:group-hover:bg-[#F63EA1]/20 transition"></div>
                    <div class="flex justify-between items-start relative z-10">
                        <div>
                            <p class="text-white/80 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Pengunjung</p>
                            <h3 class="text-3xl font-bold text-white flex items-baseline gap-1">
                                <span class="counter" data-target="{{ $totalViews }}">0</span>
                            </h3>
                        </div>
                        <div class="p-2 bg-white/20 dark:bg-slate-800/80 rounded-lg text-white dark:text-[#F63EA1]">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </div>
                    </div>
                </div>

                <!-- Card: Undangan Terkirim -->
                <div class="stat-card p-5 rounded-2xl relative overflow-hidden group">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/20 dark:bg-yellow-500/10 rounded-full blur-xl group-hover:bg-white/30 dark:group-hover:bg-yellow-500/20 transition"></div>
                    <div class="flex justify-between items-start relative z-10">
                        <div>
                            <p class="text-white/80 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Undangan Terkirim</p>
                            <h3 class="text-3xl font-bold text-white flex items-baseline gap-1">
                                <span class="counter" data-target="{{ count($links) }}">0</span>
                            </h3>
                        </div>
                        <div class="p-2 bg-white/20 dark:bg-slate-800/80 rounded-lg text-white dark:text-yellow-400">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        </div>
                    </div>
                </div>

                <!-- Card: Hadir -->
                <div class="stat-card p-5 rounded-2xl relative overflow-hidden group">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/20 dark:bg-emerald-500/10 rounded-full blur-xl group-hover:bg-white/30 dark:group-hover:bg-emerald-500/20 transition"></div>
                    <div class="flex justify-between items-start relative z-10">
                        <div>
                            <p class="text-white/80 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Bersedia Hadir</p>
                            <h3 class="text-3xl font-bold text-white flex items-baseline gap-1">
                                <span class="counter" data-target="{{ $rsvps->where('status', 'Hadir')->count() }}">0</span>
                            </h3>
                        </div>
                        <div class="p-2 bg-white/20 dark:bg-slate-800/80 rounded-lg text-white dark:text-emerald-400">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </div>
                </div>

                <!-- Card: Tidak Hadir -->
                <div class="stat-card p-5 rounded-2xl relative overflow-hidden group">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/20 dark:bg-red-500/10 rounded-full blur-xl group-hover:bg-white/30 dark:group-hover:bg-red-500/20 transition"></div>
                    <div class="flex justify-between items-start relative z-10">
                        <div>
                            <p class="text-white/80 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Belum Bisa Hadir</p>
                            <h3 class="text-3xl font-bold text-white flex items-baseline gap-1">
                                <span class="counter" data-target="{{ $rsvps->where('status', 'Tidak Hadir')->count() }}">0</span>
                            </h3>
                        </div>
                        <div class="p-2 bg-white/20 dark:bg-slate-800/80 rounded-lg text-white dark:text-red-400">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Traffic Chart Section -->
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-8">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Traffic Pengunjung</h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400">Statistik pengunjung undangan dalam 30 hari terakhir</p>
                    </div>
                    <div class="hidden sm:flex items-center gap-2">
                        <span class="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400"><span class="w-3 h-3 rounded-full bg-indigo-500"></span> Pengunjung</span>
                    </div>
                </div>
                <div class="w-full h-[300px]">
                    <canvas id="trafficChart"></canvas>
                </div>
            </div>
            
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    // Initialize counters
                    const counters = document.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        animateValue(counter, 0, target, 2000);
                    });

                    // Initialize Chart
                    const ctx = document.getElementById('trafficChart').getContext('2d');
                    const trafficLabels = @json($trafficLabels);
                    const trafficData = @json($trafficData);
                    
                    // Create gradient
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)'); // indigo-600
                    gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
                    
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: trafficLabels,
                            datasets: [{
                                label: 'Pengunjung',
                                data: trafficData,
                                borderColor: '#4f46e5', // indigo-600
                                backgroundColor: gradient,
                                borderWidth: 3,
                                pointBackgroundColor: '#ffffff',
                                pointBorderColor: '#4f46e5',
                                pointBorderWidth: 2,
                                pointRadius: 4,
                                pointHoverRadius: 6,
                                fill: true,
                                tension: 0.4 // Smooth curves
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    backgroundColor: '#1e293b',
                                    titleFont: { family: 'Inter', size: 13 },
                                    bodyFont: { family: 'Inter', size: 14, weight: 'bold' },
                                    padding: 12,
                                    cornerRadius: 8,
                                    displayColors: false,
                                    callbacks: {
                                        label: function(context) { return context.parsed.y + ' Pengunjung'; }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    grid: { display: false, drawBorder: false },
                                    ticks: { font: { family: 'Inter', size: 11 }, color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b', maxTicksLimit: 7 }
                                },
                                y: {
                                    grid: { color: document.documentElement.classList.contains('dark') ? '#334155' : '#f1f5f9', drawBorder: false },
                                    ticks: { font: { family: 'Inter', size: 11 }, color: '#64748b', precision: 0 },
                                    beginAtZero: true
                                }
                            },
                            interaction: { mode: 'index', intersect: false }
                        }
                    });
                });
            </script>
        </div>

        <!-- TAB: TAMU / KIRIM WA -->
        <div x-show="activeTab === 'tamu'" x-cloak x-transition.opacity.duration.300ms>
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8 p-6">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Atur Template Pesan WhatsApp</h2>
                <div class="bg-blue-50 dark:bg-indigo-900/20 border border-blue-100 dark:border-indigo-800/50 rounded-xl p-4 mb-5">
                    <h3 class="text-sm font-bold text-blue-800 dark:text-indigo-300 mb-2">Panduan Penggunaan Variabel:</h3>
                    <ul class="text-sm text-blue-700 dark:text-indigo-400 space-y-1.5 list-disc list-inside">
                        <li>Gunakan teks <code class="bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded shadow-sm font-bold border border-blue-200 dark:border-indigo-700/50">[NAMA_TAMU]</code> yang nantinya akan <strong>otomatis berubah</strong> menjadi nama masing-masing tamu.</li>
                        <li>Gunakan teks <code class="bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded shadow-sm font-bold border border-blue-200 dark:border-indigo-700/50">[LINK_UNDANGAN]</code> yang nantinya akan <strong>otomatis berubah</strong> menjadi tautan/link unik undangan.</li>
                        <li><strong>Penting:</strong> Jangan sampai <em>typo</em> (salah ketik) atau mengubah format kurung sikunya.</li>
                        <li>Anda bebas meletakkan kedua variabel tersebut di bagian mana saja (atas, tengah, atau bawah pesan). Teks ini hanya digunakan untuk men-<em>generate</em> pesan WhatsApp secara otomatis.</li>
                    </ul>
                </div>
                
                <form action="/client/{{ $invitation->slug }}/greeting" method="POST">
                    @csrf
                    <textarea name="whatsapp_greeting" rows="5" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none mb-4" placeholder="Kepada Yth. [NAMA_TAMU],&#10;&#10;Kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.&#10;&#10;Buka undangan di sini:&#10;[LINK_UNDANGAN]&#10;&#10;Terima kasih.">{{ $invitation->whatsapp_greeting ?? "Kepada Yth. [NAMA_TAMU],\n\nKami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBuka undangan di sini:\n[LINK_UNDANGAN]\n\nTerima kasih." }}</textarea>
                    <button type="submit" class="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-sm">
                        Simpan Template
                    </button>
                </form>
            </div>

            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8 p-6">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Buat Daftar Tamu</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Masukkan nama tamu gunakan koma (,) atau garis baru (Enter) untuk memisahkan masing-masing nama tamu.</p>
                
                @if(session('success'))
                    <script>
                        document.addEventListener('DOMContentLoaded', function() {
                            Toast.fire({
                                icon: 'success',
                                title: '{{ session('success') }}'
                            });
                        });
                    </script>
                @endif
                
                <form action="/client/{{ $invitation->slug }}/links/batch" method="POST">
                    @csrf
                    <textarea name="guest_names" rows="4" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none mb-4" placeholder="Tamu1, Tamu2, Tamu3..."></textarea>
                    <button type="submit" class="w-full sm:w-auto px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition shadow-sm">
                        Buat List
                    </button>
                </form>
            </div>

            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 class="text-lg font-bold text-slate-900 dark:text-white">Kirim Undangan Spesial</h2>
                        <p class="text-sm text-slate-500 dark:text-slate-400">Sebarkan undangan Anda via WhatsApp secara instan.</p>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-slate-50 dark:bg-slate-800/50/80">
                            <tr>
                                <th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Tamu</th>
                                <th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Link Unik</th>
                                <th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            @forelse($links as $link)
                                <tr class="hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800/60 dark:bg-slate-800/30/50 transition group">
                                    <td class="px-6 py-4">
                                        <p class="font-bold text-slate-800 dark:text-slate-200">{{ $link->guest_name }}</p>
                                    </td>
                                    <td class="px-6 py-4 hidden md:table-cell">
                                        <div class="flex items-center gap-2">
                                            <input type="text" readonly value="{{ url('/' . $invitation->slug . '?to=' . urlencode($link->guest_name)) }}" class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs rounded px-2 py-1.5 w-full max-w-[250px] focus:outline-none">
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <div class="flex items-center justify-end gap-2">
                                            <button @click="qrName = '{{ addslashes($link->guest_name) }}'; qrUrl = '{{ url('/' . $invitation->slug . '?to=' . urlencode($link->guest_name)) }}'; qrModalOpen = true;" class="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold transition shadow-sm hover:shadow" title="Tampilkan QR Code">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                                                <span class="hidden sm:inline">QR</span>
                                            </button>
                                            <button onclick="shareWhatsApp('{{ addslashes($link->guest_name) }}')" class="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition shadow-sm hover:shadow">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                                <span class="hidden sm:inline">Kirim WA</span>
                                            </button>
                                            <form action="/client/{{ $invitation->slug }}/links/{{ $link->id }}" method="POST" class="inline-block m-0" onsubmit="confirmDelete(event, this);">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="inline-flex items-center justify-center p-2 bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 text-red-500 hover:text-red-600 rounded-lg transition shadow-sm" title="Hapus Tamu">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="3" class="px-6 py-12 text-center">
                                        <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                        </div>
                                        <h3 class="text-slate-900 dark:text-white font-bold mb-1">Belum Ada Tamu</h3>
                                        <p class="text-slate-500 dark:text-slate-400 text-sm">Hubungi admin untuk membuat daftar tamu undangan Anda.</p>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- TAB: WISHES / RSVP -->
        <div x-show="activeTab === 'wishes'" x-cloak x-transition.opacity.duration.300ms>
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[600px] max-h-[80vh]">
                <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Wishes & Konfirmasi Kehadiran
                        <span class="bg-indigo-100 text-indigo-700 dark:text-indigo-400 py-0.5 px-2.5 rounded-full text-xs">{{ count($rsvps) }}</span>
                    </h2>
                    
                    <a href="{{ route('client.export.rsvps', $invitation->slug) }}" class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition shadow-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Unduh ke Excel
                    </a>
                </div>
                
                <div class="p-6 overflow-y-auto wishes-scroll flex-1 bg-slate-50 dark:bg-slate-800/50/50">
                    @forelse($rsvps as $rsvp)
                        <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 shadow-sm mb-4 transition hover:shadow-md relative group">
                            <!-- Badge Status -->
                            <div class="absolute top-4 right-4">
                                <span class="px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider {{ $rsvp->status == 'Hadir' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200' }}">
                                    {{ $rsvp->status }}
                                </span>
                            </div>
                            
                            <div class="flex items-start gap-4">
                                <!-- Avatar Placeholder -->
                                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                    {{ strtoupper(substr($rsvp->name, 0, 1)) }}
                                </div>
                                
                                <div class="flex-1 min-w-0 pr-16">
                                    <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-0.5">{{ $rsvp->name }}</h4>
                                    <p class="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {{ \Carbon\Carbon::parse($rsvp->created_at)->diffForHumans() }}
                                    </p>
                                    
                                    @if($rsvp->message)
                                        <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 text-slate-600 dark:text-slate-400 text-sm leading-relaxed relative">
                                            <!-- Quote icon watermark -->
                                            <svg class="absolute top-2 left-2 w-6 h-6 text-slate-200 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                                            <p class="relative z-10 italic">"{{ $rsvp->message }}"</p>
                                        </div>
                                    @else
                                        <p class="text-sm text-slate-400 italic">Tidak ada pesan yang ditinggalkan.</p>
                                    @endif
                                </div>
                            </div>
                        </div>
                    @empty
                        <div class="h-full flex flex-col items-center justify-center text-center p-8">
                            <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                            </div>
                            <h3 class="font-bold text-slate-900 dark:text-white mb-1">Belum Ada Ucapan</h3>
                            <p class="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">Kirimkan undangan Anda segera agar tamu dapat mengisi buku tamu dan memberikan ucapan spesial.</p>
                        </div>
                    @endforelse
                </div>
            </div>
        </div>

    </main>

    <!-- Bottom Navigation for Mobile -->
    <nav class="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 px-6 py-2 flex justify-between items-center pb-safe">
        <button @click="activeTab = 'dashboard'" :class="{'text-indigo-600': activeTab === 'dashboard', 'text-slate-400': activeTab !== 'dashboard'}" class="flex flex-col items-center p-2 transition">
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            <span class="text-[10px] font-semibold">Dasbor</span>
        </button>
        <button @click="activeTab = 'tamu'" :class="{'text-indigo-600': activeTab === 'tamu', 'text-slate-400': activeTab !== 'tamu'}" class="flex flex-col items-center p-2 transition">
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            <span class="text-[10px] font-semibold">Sebar</span>
        </button>
        <button @click="activeTab = 'wishes'" :class="{'text-indigo-600': activeTab === 'wishes', 'text-slate-400': activeTab !== 'wishes'}" class="flex flex-col items-center p-2 transition">
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            <span class="text-[10px] font-semibold">Buku Tamu</span>
        </button>
    </nav>

    <!-- Modal QR Code -->
    <div x-show="qrModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm" style="display: none;" x-transition.opacity>
        <div @click.away="qrModalOpen = false" class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-[90%] max-w-sm overflow-hidden" x-show="qrModalOpen" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100">
            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50/50">
                <h3 class="font-bold text-slate-900 dark:text-white">QR Code Undangan</h3>
                <button @click="qrModalOpen = false" class="text-slate-400 hover:text-slate-600 dark:text-slate-400 transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="p-6 flex flex-col items-center text-center">
                <div class="mb-4 bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                    <img :src="'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(qrUrl)" alt="QR Code" class="w-[200px] h-[200px] object-contain">
                </div>
                <h4 class="font-bold text-slate-800 dark:text-slate-200 text-lg mb-1" x-text="qrName"></h4>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mb-6 break-all line-clamp-2" x-text="qrUrl"></p>
                <div class="flex gap-2 w-full">
                    <button @click="navigator.clipboard.writeText(qrUrl); alert('Link berhasil disalin!');" class="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-sm transition flex justify-center items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                        Salin Link
                    </button>
                    <a :href="'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=' + encodeURIComponent(qrUrl)" download="QR_Undangan.png" target="_blank" class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition flex justify-center items-center gap-1.5 shadow-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Download
                    </a>
                </div>
            </div>
        </div>
    </div>

    <script>
        function shareWhatsApp(guestName) {
            const invitation = window.__INVITATION__;
            const url = `${window.location.origin}/${invitation.slug}?to=${encodeURIComponent(guestName)}`;
            
            let template = invitation.whatsapp_greeting || `Kepada Yth. [NAMA_TAMU],\n\nKami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBuka undangan di sini:\n[LINK_UNDANGAN]\n\nTerima kasih.`;
            
            let message = template
                .replace(/\[NAMA_TAMU\]/g, guestName)
                .replace(/\[LINK_UNDANGAN\]/g, url);
                
            if (!template.includes('[LINK_UNDANGAN]')) {
                message += `\n\nLink Undangan: ${url}`;
            }
                
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
        }
    </script>
</body>
</html>
