<x-filament-panels::page>
    <div x-data="photobooth()" class="max-w-4xl mx-auto w-full bg-white rounded-3xl shadow-2xl overflow-hidden" style="min-height: 80vh;">
        <!-- Beautiful animated background or simple header -->
        <div class="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white text-center">
            <h1 class="text-4xl font-black tracking-tight drop-shadow-md">Nalaruang Studio 📸✨</h1>
            <p class="text-white/80 mt-2 font-medium">Senyum yang lebar ya!</p>
        </div>

        <div class="p-8">
            <!-- Step 1: Select Template -->
            <div x-show="step === 1" x-transition.opacity.duration.500ms>
                <h2 class="text-2xl font-bold text-gray-800 text-center mb-8">Pilih Frame Favoritmu!</h2>
                @if(count($templates) > 0)
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    @foreach($templates as $template)
                    <div wire:click="selectTemplate({{ $template->id }})" @click="setTemplate({{ $template->cut_count }}, '{{ asset('storage/' . $template->frame_image) }}')" class="cursor-pointer group relative rounded-2xl overflow-hidden border-4 border-transparent hover:border-pink-500 transition-all hover:scale-105 shadow-md bg-gray-50 aspect-[2/5] flex items-center justify-center">
                        <img src="{{ asset('storage/' . $template->frame_image) }}" class="w-full h-full object-contain pointer-events-none drop-shadow-lg" alt="{{ $template->name }}">
                        <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                            <p class="text-white font-bold text-center">{{ $template->name }}</p>
                        </div>
                    </div>
                    @endforeach
                </div>
                @else
                <div class="text-center text-gray-500 py-12">
                    <p>Belum ada template. Silakan tambahkan di menu Template Foto terlebih dahulu.</p>
                </div>
                @endif
            </div>

            <!-- Step 2: Camera Area -->
            <div x-show="step === 2" x-transition.opacity style="display: none;" class="relative flex flex-col items-center">
                <div class="flex justify-between w-full mb-4">
                    <button @click="resetSession()" wire:click="cancelSession" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full transition-colors flex items-center gap-2">
                        ← Kembali
                    </button>
                    <div class="text-xl font-bold text-pink-600 bg-pink-100 px-4 py-2 rounded-full border border-pink-200">
                        Foto ke: <span x-text="currentCut + 1"></span> / <span x-text="cutCount"></span>
                    </div>
                </div>

                <!-- Camera Container -->
                <div class="relative w-[400px] h-[600px] bg-black rounded-3xl overflow-hidden shadow-inner border-8 border-gray-100 flex items-center justify-center">
                    <video x-ref="video" autoplay playsinline class="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"></video>
                    
                    <!-- Overlay Template -->
                    <img x-show="templateUrl" :src="templateUrl" class="absolute inset-0 w-full h-full object-contain pointer-events-none z-10" />

                    <!-- Countdown Overlay -->
                    <div x-show="countdown > 0" class="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm" x-transition>
                        <span x-text="countdown" class="text-9xl font-black text-white drop-shadow-[0_0_20px_rgba(255,0,128,0.8)] animate-pulse"></span>
                    </div>

                    <!-- Flash Effect -->
                    <div x-show="flash" class="absolute inset-0 z-30 bg-white" x-transition.opacity.duration.200ms></div>
                </div>

                <!-- Controls -->
                <div class="mt-8">
                    <button x-show="!isCapturing" @click="startCaptureSequence()" class="px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-2xl font-black rounded-full shadow-xl shadow-pink-500/30 hover:scale-105 transition-transform animate-bounce">
                        MULAI FOTO! 📷
                    </button>
                    <p x-show="isCapturing" class="text-gray-500 font-bold text-lg animate-pulse">Bersiaplah, lihat ke kamera...</p>
                </div>
                
                <!-- Hidden Canvas for compiling -->
                <canvas x-ref="canvas" style="display:none;"></canvas>
            </div>

            <!-- Step 3: Result & Print -->
            <div x-show="step === 3" x-transition.opacity style="display: none;" class="text-center">
                <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-8">Yeay! Ini Hasil Fotomu 🎉</h2>
                
                <div class="flex flex-col md:flex-row justify-center items-center gap-12">
                    <div class="w-[300px] bg-white p-4 shadow-xl rounded-sm transform rotate-[-2deg] transition-transform hover:rotate-0">
                        <img :src="finalResult" class="w-full object-contain" />
                    </div>
                    
                    <div class="flex flex-col gap-4">
                        <button @click="printPhoto()" class="w-full px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-2xl shadow-lg shadow-green-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                            Cetak Sekarang!
                        </button>
                        
                        <button @click="resetSession()" wire:click="cancelSession" class="w-full px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xl rounded-2xl transition-colors">
                            Foto Lagi 📸
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Hidden Printable Area -->
    <div id="print-area" class="hidden">
        <img x-bind:src="finalResult" style="width: 100%; height: 100%; object-fit: contain; page-break-inside: avoid; display: block; margin: 0 auto;" />
    </div>

    <style>
        @media print {
            body * {
                visibility: hidden;
            }
            #print-area, #print-area * {
                visibility: visible;
                display: block !important;
            }
            #print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                display: flex !important;
                align-items: center;
                justify-content: center;
            }
            @page {
                size: auto;   /* auto is the initial value */
                margin: 0;  /* this affects the margin in the printer settings */
            }
        }
    </style>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('photobooth', () => ({
                step: 1,
                stream: null,
                templateUrl: '',
                cutCount: 4,
                currentCut: 0,
                countdown: 0,
                isCapturing: false,
                flash: false,
                photos: [],
                finalResult: null,

                setTemplate(count, url) {
                    this.cutCount = count;
                    this.templateUrl = url;
                    this.step = 2;
                    this.startCamera();
                },

                async startCamera() {
                    try {
                        this.stream = await navigator.mediaDevices.getUserMedia({ 
                            video: { width: 1280, height: 720, facingMode: "user" } 
                        });
                        this.$refs.video.srcObject = this.stream;
                    } catch (err) {
                        alert("Maaf, tidak dapat mengakses kamera! Pastikan browser diizinkan mengakses kamera.");
                        console.error(err);
                    }
                },

                stopCamera() {
                    if (this.stream) {
                        this.stream.getTracks().forEach(track => track.stop());
                    }
                },

                startCaptureSequence() {
                    this.isCapturing = true;
                    this.currentCut = 0;
                    this.photos = [];
                    this.takeNextPhoto();
                },

                takeNextPhoto() {
                    if (this.currentCut >= this.cutCount) {
                        this.finishSession();
                        return;
                    }

                    this.countdown = 3;
                    
                    // Simple Beep using Web Audio API
                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    
                    const tick = setInterval(() => {
                        this.countdown--;
                        
                        // Play small beep
                        if(this.countdown > 0) {
                            let osc = audioCtx.createOscillator();
                            osc.connect(audioCtx.destination);
                            osc.frequency.value = 800;
                            osc.start();
                            osc.stop(audioCtx.currentTime + 0.1);
                        }

                        if (this.countdown <= 0) {
                            clearInterval(tick);
                            
                            // Play snap beep
                            let snapOsc = audioCtx.createOscillator();
                            snapOsc.connect(audioCtx.destination);
                            snapOsc.frequency.value = 1200;
                            snapOsc.start();
                            snapOsc.stop(audioCtx.currentTime + 0.3);

                            this.flash = true;
                            setTimeout(() => { this.flash = false; }, 150);

                            this.captureFrame();
                            
                            this.currentCut++;
                            setTimeout(() => {
                                this.takeNextPhoto();
                            }, 1000);
                        }
                    }, 1000);
                },

                captureFrame() {
                    const video = this.$refs.video;
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    
                    // Mirror the image horizontally
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                    // Draw centered and cropped
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    this.photos.push(canvas.toDataURL('image/jpeg', 0.9));
                },

                finishSession() {
                    this.isCapturing = false;
                    this.stopCamera();
                    this.compileFinalImage();
                },

                compileFinalImage() {
                    const canvas = this.$refs.canvas;
                    const ctx = canvas.getContext('2d');
                    
                    // Standard Photostrip width 600x1800 (ratio 1:3)
                    canvas.width = 600;
                    canvas.height = 1800; 
                    
                    // Draw white background
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // Auto-calculate grid layout vertically
                    const paddingX = 40;
                    const paddingY = 120; // top padding
                    const gap = 20;
                    const photoWidth = canvas.width - (paddingX * 2);
                    const bottomPadding = 250;
                    const photoHeight = (canvas.height - paddingY - bottomPadding - (gap * (this.cutCount - 1))) / this.cutCount;
                    
                    let loaded = 0;
                    this.photos.forEach((photoDataUrl, index) => {
                        const img = new Image();
                        img.onload = () => {
                            const x = paddingX;
                            const y = paddingY + (index * (photoHeight + gap));
                            
                            // To fit without stretching, we should crop from center
                            // Calculate aspect ratio
                            const aspect = photoWidth / photoHeight;
                            const imgAspect = img.width / img.height;
                            
                            let sx, sy, sWidth, sHeight;
                            if (imgAspect > aspect) {
                                // Image is wider
                                sHeight = img.height;
                                sWidth = img.height * aspect;
                                sy = 0;
                                sx = (img.width - sWidth) / 2;
                            } else {
                                // Image is taller
                                sWidth = img.width;
                                sHeight = img.width / aspect;
                                sx = 0;
                                sy = (img.height - sHeight) / 2;
                            }
                            
                            ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, photoWidth, photoHeight);
                            
                            loaded++;
                            if(loaded === this.cutCount) {
                                this.drawOverlay(ctx, canvas);
                            }
                        };
                        img.src = photoDataUrl;
                    });
                },

                drawOverlay(ctx, canvas) {
                    const templateImg = new Image();
                    templateImg.onload = () => {
                        ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
                        this.finalResult = canvas.toDataURL('image/png');
                        this.step = 3;
                        
                        // Send base64 to Livewire to save securely on the server!
                        @this.savePhotoSession(this.finalResult);
                    };
                    templateImg.src = this.templateUrl;
                },

                resetSession() {
                    this.stopCamera();
                    this.step = 1;
                    this.photos = [];
                    this.finalResult = null;
                },

                printPhoto() {
                    window.print();
                }
            }));
        });
    </script>
</x-filament-panels::page>
