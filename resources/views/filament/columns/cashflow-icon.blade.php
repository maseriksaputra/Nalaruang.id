<div class="flex items-center justify-center w-10 h-10 rounded-full {{ $getRecord()->type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600' }}">
    @if($getRecord()->type === 'income')
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7V17"></path></svg>
    @else
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 7L7 17M7 17H17M7 17V7"></path></svg>
    @endif
</div>
