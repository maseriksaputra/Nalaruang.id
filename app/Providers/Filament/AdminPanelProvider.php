<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Filament\View\PanelsRenderHook;
use Filament\Navigation\NavigationGroup;
use Filament\Navigation\NavigationItem;
use Illuminate\Contracts\View\View;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->colors([
                'primary' => '#C40B93', // Nalaruang primary
                'gray' => Color::Slate,
            ])
            ->font('Plus Jakarta Sans')
            ->brandName('Nalaruang.id')
            ->brandLogo(fn () => asset('logo.png'))
            ->brandLogoHeight('6rem')
            ->favicon('/logo1.png?v=2')
            ->sidebarCollapsibleOnDesktop()
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->navigationGroups([
                NavigationGroup::make()
                     ->label('Transaksi & Keuangan')
                     ->collapsible(false),
                NavigationGroup::make()
                     ->label('Manajemen Toko')
                     ->collapsible(false),
                NavigationGroup::make()
                     ->label('Lalu Lintas & Tamu')
                     ->collapsible(false),
                NavigationGroup::make()
                     ->label('Manajemen Pelanggan')
                     ->collapsible(false),
                NavigationGroup::make()
                     ->label('Konten Website')
                     ->collapsible(false),
                NavigationGroup::make()
                     ->label('Nalaruang Studio')
                     ->collapsible(false),
            ])
            ->navigationItems([
                NavigationItem::make('Studio Undangan')
                    ->icon('heroicon-o-sparkles')
                    ->group('Nalaruang Studio')
                    ->badge(fn () => \Illuminate\Support\Facades\Cache::remember('pending_orders_count', 60, fn () => \App\Models\Order::where('status', 'pending')->count()) ?: null, 'warning')
                    ->url(fn (): string => url('/admin/invitation-portal'))
                    ->openUrlInNewTab(),
            ])
            ->pages([
                \App\Filament\Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                // Widgets\AccountWidget::class,
                // Widgets\FilamentInfoWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->renderHook(
                PanelsRenderHook::STYLES_AFTER,
                fn (): View => view('filament.custom-css'),
            )
            ->renderHook(
                PanelsRenderHook::SIDEBAR_NAV_END,
                fn (): View => view('filament.sidebar-logout'),
            )
            ->renderHook(
                PanelsRenderHook::PAGE_START,
                fn () => new \Illuminate\Support\HtmlString('
                    <div style="display: none;">
                        <a id="global-back-btn-source" href="javascript:history.back()" style="display:inline-flex; align-items:center; justify-content:center; background-color: #C40B93; color: white; border-radius: 0.5rem; width: 36px; height: 36px; margin-right: 0.75rem; box-shadow: 0 2px 4px rgba(196, 11, 147, 0.3); transition: transform 0.2s; text-decoration: none;" onmouseover="this.style.transform=\'scale(1.05)\'" onmouseout="this.style.transform=\'scale(1)\'" title="Kembali">
                            <svg style="width:20px; height:20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
                        </a>
                    </div>
                    <script>
                        (function() {
                            function injectBackBtn() {
                                const heading = document.querySelector(".fi-header-heading");
                                const source = document.getElementById("global-back-btn-source");
                                if (heading && source && !document.getElementById("global-back-btn-active")) {
                                    const btn = source.cloneNode(true);
                                    btn.id = "global-back-btn-active";
                                    heading.style.display = "flex";
                                    heading.style.alignItems = "center";
                                    heading.insertBefore(btn, heading.firstChild);
                                }
                            }
                            
                            // Check immediately
                            setTimeout(injectBackBtn, 10);
                            
                            // Watch for DOM changes (Livewire updates replacing the header)
                            const observer = new MutationObserver(injectBackBtn);
                            observer.observe(document.documentElement, { childList: true, subtree: true });
                        })();
                    </script>
                ')
            );
    }
}
