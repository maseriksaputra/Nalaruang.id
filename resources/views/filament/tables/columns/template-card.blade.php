@php
    $record = $getRecord();
    $iframeUrl = $record->preview_url;
    if ($iframeUrl && !str_contains($iframeUrl, 'preview=')) {
        $iframeUrl .= (str_contains($iframeUrl, '?') ? '&' : '?') . 'preview=1';
    }
@endphp

<style>
    /* Override Filament Grid Record padding for perfect spacing */
    .fi-ta-grid .fi-ta-record {
        padding: 1rem !important;
        border-radius: 1rem !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
        border: 1px solid #f1f5f9 !important;
    }
    
    /* Style the action container to look like the mockup's light-gray pill */
    .fi-ta-grid .fi-ta-record .fi-ta-actions,
    .fi-ta-grid .fi-ta-record .fi-ac-action-group,
    .fi-ta-grid .fi-ta-record > div:last-child > div > div {
        display: flex !important;
        justify-content: space-between !important; /* Push Edit to left, Delete to right */
        align-items: center !important;
        background-color: #f8fafc !important;
        border-radius: 0.75rem !important;
        padding: 0.5rem 1rem !important;
        margin-top: 1.25rem !important;
        width: 100% !important;
        gap: 0 !important;
    }
    
    /* Style the action buttons to have specific colors matching mockup */
    .fi-ta-grid .fi-ta-record .fi-ta-actions button,
    .fi-ta-grid .fi-ta-record .fi-ta-actions a {
        background: transparent !important;
        box-shadow: none !important;
        color: #64748b; /* Default icon color */
    }
    .fi-ta-grid .fi-ta-record .fi-ta-actions button:hover,
    .fi-ta-grid .fi-ta-record .fi-ta-actions a:hover {
        background: #f1f5f9 !important;
    }
</style>

<div class="flex flex-col h-full font-sans" style="min-height: 100%;">
    
    <!-- Image Section -->
    <div class="relative w-full bg-gray-100 overflow-hidden mb-3" style="border-radius: 0.75rem; aspect-ratio: 4/3;">
        @if($record->image)
            <img src="{{ rtrim(str_replace('test.txt', '', Storage::url('test.txt')), '/') . '/' . $record->image }}" alt="{{ $record->name }}" class="w-full h-full object-cover" style="width: 100%; height: 100%; object-fit: cover;">
        @elseif($iframeUrl)
            <!-- Iframe Preview Fallback -->
            <div style="width: 414px; height: 896px; transform: scale(0.65); transform-origin: top left; pointer-events: none;">
                <iframe src="{{ $iframeUrl }}" style="width: 100%; height: 100%; border: none;" tabindex="-1" loading="lazy"></iframe>
            </div>
        @else
            <img src="https://placehold.co/600x800/eef2f0/2A4035?text=No+Img" alt="{{ $record->name }}" class="w-full h-full object-cover" style="width: 100%; height: 100%; object-fit: cover;">
        @endif
        
        <!-- Top Left Badge (Aktif) -->
        <div class="absolute top-2 left-2" style="position: absolute; top: 0.5rem; left: 0.5rem;">
            @if($record->is_active)
                <span class="shadow-sm" style="background-color: rgba(255,255,255,0.95); color: #d81b60; font-size: 10px; font-weight: bold; padding: 4px 10px; border-radius: 9999px;">
                    Aktif
                </span>
            @else
                <span class="shadow-sm" style="background-color: rgba(255,255,255,0.95); color: #6b7280; font-size: 10px; font-weight: bold; padding: 4px 10px; border-radius: 9999px;">
                    Draft
                </span>
            @endif
        </div>
        
        <!-- Top Right Icon (Heart) -->
        <div class="absolute top-2 right-2 shadow-sm" style="position: absolute; top: 0.5rem; right: 0.5rem; background-color: rgba(255,255,255,0.95); color: #9ca3af; padding: 6px; border-radius: 9999px;">
            <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </div>
    </div>
    
    <!-- Content Section -->
    <div class="flex flex-col flex-grow" style="display: flex; flex-direction: column; flex-grow: 1;">
        
        <!-- Category Badge -->
        <div class="mb-2" style="margin-bottom: 0.5rem; display: flex;">
            @if($record->serviceCategory)
                <span style="background-color: #eff6ff; color: #2563eb; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 4px;">
                    {{ $record->serviceCategory->name }}
                </span>
            @elseif($record->category)
                <span style="background-color: #eff6ff; color: #2563eb; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 4px;">
                    {{ $record->category }}
                </span>
            @else
                <div style="height: 1rem;"></div>
            @endif
        </div>
        
        <!-- Title -->
        <h3 class="font-bold text-gray-900 truncate" style="font-size: 15px; font-weight: 700; color: #111827; line-height: 1.3; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            {{ $record->name }}
        </h3>
        
        <!-- Price (Pink color, Bold, No Decimals) -->
        <div class="mb-4" style="margin-bottom: 1rem;">
            @if($record->discount_price)
                <span style="font-size: 12px; color: #9ca3af; text-decoration: line-through; margin-right: 4px;">Rp {{ number_format($record->price, 0, ',', '.') }}</span>
                <span style="font-size: 15px; font-weight: 800; color: #d81b60;">Rp {{ number_format($record->discount_price, 0, ',', '.') }}</span>
            @else
                <span style="font-size: 15px; font-weight: 800; color: #d81b60;">Rp {{ number_format($record->price, 0, ',', '.') }}</span>
            @endif
        </div>
        
        <div style="margin-top: auto; border-top: 1px solid #f3f4f6; padding-top: 0.75rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0.25rem; position: relative;">
                <!-- Terjual -->
                <div style="display: flex; flex-direction: column;"
                    x-data="{
                        current: {{ $record->orders_count ?? 0 }},
                        diff: 0,
                        init() {
                            let key = 'card_orders_{{ $record->id }}';
                            let stored = localStorage.getItem(key);
                            if (stored !== null) {
                                this.diff = this.current - parseInt(stored);
                            }
                            localStorage.setItem(key, this.current);
                        }
                    }">
                    <div style="display: flex; align-items: center; gap: 2px;">
                        <span style="font-weight: 700; color: #111827; font-size: 14px; line-height: 1;">{{ $record->orders_count ?? 0 }}</span>
                        
                        <span x-show="diff > 0" x-cloak
                            x-transition:enter="transition ease-out duration-300"
                            x-transition:enter-start="opacity-0 transform scale-75 -translate-y-1"
                            x-transition:enter-end="opacity-100 transform scale-100 translate-y-0"
                            style="display: inline-flex; flex-direction: row; flex-wrap: nowrap; white-space: nowrap; align-items: center; background: #ecfdf5; color: #10b981; font-size: 9px; font-weight: 800; padding: 1px 3px; border-radius: 4px; line-height: 1;">
                            <svg style="width: 8px; height: 8px;" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                            </svg>
                            <span x-text="diff"></span>
                        </span>
                    </div>
                    <span style="font-size: 11px; color: #6b7280; margin-top: 4px;">Terjual</span>
                </div>
                
                <!-- Separator 1 -->
                <div style="position: absolute; left: 25%; transform: translateX(-50%); width: 1px; height: 24px; background-color: #e5e7eb; top: 4px;"></div>
                
                <!-- Views -->
                <div style="display: flex; flex-direction: column; padding-left: 0.25rem;"
                    x-data="{
                        current: {{ ($record->demo_views ?? 0) + ($record->total_invitation_views ?? 0) }},
                        diff: 0,
                        init() {
                            let key = 'card_views_{{ $record->id }}';
                            let stored = localStorage.getItem(key);
                            if (stored !== null) {
                                this.diff = this.current - parseInt(stored);
                            }
                            localStorage.setItem(key, this.current);
                        }
                    }">
                    <div style="display: flex; align-items: center; gap: 2px;">
                        <span style="font-weight: 700; color: #111827; font-size: 14px; line-height: 1;">{{ ($record->demo_views ?? 0) + ($record->total_invitation_views ?? 0) }}</span>
                        
                        <span x-show="diff > 0" x-cloak
                            x-transition:enter="transition ease-out duration-300"
                            x-transition:enter-start="opacity-0 transform scale-75 -translate-y-1"
                            x-transition:enter-end="opacity-100 transform scale-100 translate-y-0"
                            style="display: inline-flex; flex-direction: row; flex-wrap: nowrap; white-space: nowrap; align-items: center; background: #ecfdf5; color: #10b981; font-size: 9px; font-weight: 800; padding: 1px 3px; border-radius: 4px; line-height: 1;">
                            <svg style="width: 8px; height: 8px;" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                            </svg>
                            <span x-text="diff"></span>
                        </span>
                    </div>
                    <span style="font-size: 11px; color: #6b7280; margin-top: 4px;">Views</span>
                </div>

                <!-- Separator 2 -->
                <div style="position: absolute; left: 50%; transform: translateX(-50%); width: 1px; height: 24px; background-color: #e5e7eb; top: 4px;"></div>

                <!-- Shares -->
                <div style="display: flex; flex-direction: column; padding-left: 0.25rem;">
                    <span style="font-weight: 700; color: #111827; font-size: 14px; line-height: 1;">{{ $record->shares ?? 0 }}</span>
                    <span style="font-size: 11px; color: #6b7280; margin-top: 4px;">Share</span>
                </div>

                <!-- Separator 3 -->
                <div style="position: absolute; left: 75%; transform: translateX(-50%); width: 1px; height: 24px; background-color: #e5e7eb; top: 4px;"></div>

                <!-- Stok -->
                <div style="display: flex; flex-direction: column; padding-left: 0.25rem;">
                    <span style="font-size: 10px; color: #6b7280; line-height: 1; margin-bottom: 4px;">Stok</span>
                    @if(($record->stok ?? 0) > 0)
                        <span style="font-weight: 700; color: #22c55e; font-size: 11px; line-height: 1;">Ada</span>
                    @else
                        <span style="font-weight: 700; color: #ef4444; font-size: 11px; line-height: 1;">Habis</span>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
