<?php

namespace App\Filament\Resources\ProductPriceResource\Pages;

use App\Filament\Resources\ProductPriceResource;
use App\Models\Service;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListProductPrices extends ListRecords
{
    protected static string $resource = ProductPriceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        $tabs = [
            'Semua Produk' => Tab::make(),
        ];

        // Fetch services that have product prices or just specific known ones
        $services = Service::whereIn('title', ['Cetak Fisik Premium', 'Event Digital', 'F&B', 'Cetak Fisik'])->orWhere('is_active', true)->get();
        
        foreach ($services as $service) {
            $tabs[$service->title] = Tab::make()
                ->modifyQueryUsing(fn (Builder $query) => $query->where('service_id', $service->id));
        }

        return $tabs;
    }
}
