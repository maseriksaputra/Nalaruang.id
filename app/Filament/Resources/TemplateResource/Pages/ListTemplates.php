<?php

namespace App\Filament\Resources\TemplateResource\Pages;

use App\Filament\Resources\TemplateResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListTemplates extends ListRecords
{
    protected static string $resource = TemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->url(fn (): string => static::getResource()::getUrl('create', ['activeTab' => $this->activeTab])),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            TemplateResource\Widgets\TemplateStatsOverview::class,
        ];
    }

    public function getWidgetData(): array
    {
        return [
            'activeTab' => $this->activeTab,
        ];
    }

    public function getTabs(): array
    {
        return [
            'semua' => \Filament\Resources\Components\Tab::make('Semua Produk'),
            'cetak_fisik' => \Filament\Resources\Components\Tab::make('Cetak Fisik Premium')
                ->modifyQueryUsing(fn (\Illuminate\Database\Eloquent\Builder $query) => $query->whereHas('service', fn ($q) => $q->where('slug', 'cetak-fisik'))),
            'event_digital' => \Filament\Resources\Components\Tab::make('Event Digital')
                ->modifyQueryUsing(fn (\Illuminate\Database\Eloquent\Builder $query) => $query->whereHas('service', fn ($q) => $q->where('slug', 'event-digital'))),
            'souvenir' => \Filament\Resources\Components\Tab::make('Souvenir & Merchandise')
                ->modifyQueryUsing(fn (\Illuminate\Database\Eloquent\Builder $query) => $query->whereHas('service', fn ($q) => $q->where('slug', 'souvenir-merchandise'))),
            'web_app' => \Filament\Resources\Components\Tab::make('Web & Mobile App')
                ->modifyQueryUsing(fn (\Illuminate\Database\Eloquent\Builder $query) => $query->whereHas('service', fn ($q) => $q->where('slug', 'web-mobile-app'))),
        ];
    }
}
