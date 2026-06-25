<div x-data="{ isOpen: false }" 
     @open-chat.window="isOpen = true; setTimeout(() => { $refs.chatInput.focus(); let msgs = document.getElementById('chat-messages'); if(msgs) msgs.scrollTop = msgs.scrollHeight; }, 100);"
     class="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
     
    <!-- Chat Window -->
    <div x-show="isOpen" 
         x-transition:enter="transition ease-out duration-300 transform"
         x-transition:enter-start="opacity-0 translate-y-4 scale-95"
         x-transition:enter-end="opacity-100 translate-y-0 scale-100"
         x-transition:leave="transition ease-in duration-200 transform"
         x-transition:leave-start="opacity-100 translate-y-0 scale-100"
         x-transition:leave-end="opacity-0 translate-y-4 scale-95"
         class="bg-white w-80 sm:w-[400px] rounded-2xl shadow-2xl border border-gray-100 mb-4 overflow-hidden flex flex-col"
         style="height: 550px; max-height: calc(100vh - 120px); display: none;">
         
        <!-- Header -->
        <div class="bg-brand-600 text-white p-4 flex justify-between items-center shadow-md z-10 relative">
            <div class="flex items-center gap-3">
                <div class="relative">
                    <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
                        <img src="{{ asset('logo.png') }}" alt="AI" class="w-full h-full object-contain">
                    </div>
                    <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-brand-600 rounded-full"></div>
                </div>
                <div>
                    <h3 class="font-bold text-sm">Nalaruang AI Assistant</h3>
                    <p class="text-xs text-brand-100 opacity-90">Online | Flash Response</p>
                </div>
            </div>
            <button @click="isOpen = false" class="text-white hover:text-brand-200 focus:outline-none transition-transform hover:scale-110 p-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Messages -->
        <div id="chat-messages" class="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4 scroll-smooth">
            @foreach($messages as $index => $message)
                @if($message['role'] === 'model')
                    <!-- AI Message -->
                    <div class="flex items-start gap-2 max-w-[90%] self-start" wire:key="msg-{{ $index }}">
                        <div class="w-7 h-7 bg-brand-100 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                            <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <div class="bg-white border border-gray-100 text-gray-800 p-3 rounded-2xl rounded-tl-sm shadow-sm text-[13px] leading-relaxed prose prose-sm max-w-none">
                            {!! \Illuminate\Support\Str::markdown($message['content']) !!}
                        </div>
                    </div>
                @else
                    <!-- User Message -->
                    <div class="flex items-start gap-2 max-w-[85%] self-end flex-row-reverse" wire:key="msg-{{ $index }}">
                        <div class="bg-brand-600 text-white p-3 rounded-2xl rounded-tr-sm shadow-sm text-[13px] leading-relaxed">
                            {{ $message['content'] }}
                        </div>
                    </div>
                @endif
            @endforeach
            
            <!-- Loading Indicator -->
            <div wire:loading.flex wire:target="fetchAiResponse" class="items-start gap-2 max-w-[85%] self-start" style="display: none;">
                <div class="w-7 h-7 bg-brand-100 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div class="bg-white border border-gray-100 text-gray-800 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-10">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
                </div>
            </div>
        </div>

        <!-- Input Area -->
        <form wire:submit="sendMessage" class="p-3 bg-white border-t border-gray-100 flex gap-2 items-center z-10 relative shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <input type="text" 
                   wire:model="newMessage" 
                   x-ref="chatInput"
                   placeholder="Tanya produk, harga, stok..." 
                   class="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                   autocomplete="off"
                   required>
            <button type="submit" 
                    wire:loading.attr="disabled"
                    class="bg-brand-600 hover:bg-brand-700 text-white w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
                <svg wire:loading.remove wire:target="fetchAiResponse" class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                <svg wire:loading wire:target="fetchAiResponse" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </button>
        </form>
    </div>
</div>

<script>
    // Audio Context Setup
    const playPopSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if(!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            // Pop sound config
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
            
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.1);
        } catch(e) {
            console.error('Audio not supported', e);
        }
    };

    document.addEventListener('livewire:initialized', () => {
        let lastMessageCount = 1;

        Livewire.hook('morph.updated', (el, component) => {
            if (component.name === 'chatbot') {
                let chatMessages = document.getElementById('chat-messages');
                if (chatMessages) {
                    // Check if new message added
                    const currentCount = chatMessages.querySelectorAll('.self-start, .self-end').length;
                    if(currentCount > lastMessageCount) {
                        playPopSound();
                        lastMessageCount = currentCount;
                    }
                    
                    setTimeout(() => {
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }, 50);
                }
            }
        });
    });
</script>
