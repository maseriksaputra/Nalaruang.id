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
use Illuminate\Contracts\View\View;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class StudioPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('studio')
            ->path('studio')
            ->login()
            ->colors([
                'primary' => '#ec4899', // Pink 500 for Studio vibe
                'gray' => Color::Slate,
            ])
            ->font('Plus Jakarta Sans')
            ->brandName('Nalaruang Studio')
            ->brandLogo(fn () => asset('logo.png')) // Use same logo or text
            ->brandLogoHeight('4rem')
            ->favicon('/logo1.png?v=2')
            ->sidebarCollapsibleOnDesktop()
            ->discoverResources(in: app_path('Filament/Studio/Resources'), for: 'App\\Filament\\Studio\\Resources')
            ->discoverPages(in: app_path('Filament/Studio/Pages'), for: 'App\\Filament\\Studio\\Pages')
            ->pages([
                \App\Filament\Studio\Pages\StudioFotoKiosk::class, // We will make this the default page soon
            ])
            ->discoverWidgets(in: app_path('Filament/Studio/Widgets'), for: 'App\\Filament\\Studio\\Widgets')
            ->widgets([
                //
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
            );
    }
}
