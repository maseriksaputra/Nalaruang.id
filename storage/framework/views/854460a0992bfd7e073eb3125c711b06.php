<!-- Lightbox Component -->
<div x-data="{ 
        isOpen: false, 
        images: [], 
        currentIndex: 0,
        touchStartX: 0,
        touchEndX: 0,
        open(e) {
            this.images = e.detail.images || [];
            this.currentIndex = 0;
            if (this.images.length > 0) {
                this.isOpen = true;
                document.body.style.overflow = 'hidden';
            }
        },
        close() {
            this.isOpen = false;
            document.body.style.overflow = '';
        },
        next() {
            if (this.images.length > 0) {
                this.currentIndex = this.currentIndex === this.images.length - 1 ? 0 : this.currentIndex + 1;
            }
        },
        prev() {
            if (this.images.length > 0) {
                this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
            }
        },
        handleTouchStart(e) {
            this.touchStartX = e.changedTouches[0].screenX;
        },
        handleTouchEnd(e) {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        },
        handleSwipe() {
            if (this.touchEndX < this.touchStartX - 50) this.next();
            if (this.touchEndX > this.touchStartX + 50) this.prev();
        }
    }"
    @open-lightbox.window="open"
    @keydown.escape.window="close"
    @keydown.arrow-right.window="if(isOpen) next()"
    @keydown.arrow-left.window="if(isOpen) prev()"
    x-show="isOpen"
    style="display: none;"
    class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center">
    
    <!-- Close button -->
    <button @click="close" class="absolute top-6 right-6 text-white/70 hover:text-white z-50 p-2">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>

    <!-- Image Container -->
    <div class="relative w-full h-full flex items-center justify-center p-4 md:p-12"
         @touchstart="handleTouchStart"
         @touchend="handleTouchEnd">
        
        <template x-if="images.length > 0">
            <img :src="images[currentIndex] ? (images[currentIndex].startsWith('http') ? images[currentIndex] : window.ASSET_URL + images[currentIndex]) : 'https://placehold.co/600x800/eef2f0/2A4035?text=Preview+Desain'" 
                 class="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-opacity duration-300"
                 alt="Preview Gambar">
        </template>

        <!-- Navigation Buttons -->
        <template x-if="images.length > 1">
            <div>
                <button @click.stop="prev" class="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-3 md:p-4 backdrop-blur-sm transition-all z-20">
                    <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button @click.stop="next" class="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-3 md:p-4 backdrop-blur-sm transition-all z-20">
                    <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
                
                <!-- Indicators -->
                <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm z-20">
                    <template x-for="(img, idx) in images" :key="idx">
                        <button @click.stop="currentIndex = idx" 
                                :class="currentIndex === idx ? 'bg-white w-3 h-3' : 'bg-white/40 hover:bg-white/70 w-2 h-2'"
                                class="rounded-full transition-all duration-300 my-auto"></button>
                    </template>
                </div>
            </div>
        </template>
    </div>
</div>
<?php /**PATH D:\laragon\www\Undangan\resources\views\components\lightbox.blade.php ENDPATH**/ ?>