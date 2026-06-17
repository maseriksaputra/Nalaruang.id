<div class="px-4 py-6 mt-auto">
    <form action="{{ route('filament.admin.auth.logout') }}" method="post">
        @csrf
        <button type="submit" class="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-rose-500 focus:outline-none">
            <x-heroicon-o-arrow-left-on-rectangle class="w-5 h-5" />
            <span>Keluar (Logout)</span>
        </button>
    </form>
</div>
