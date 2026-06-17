<?php

namespace App\Filament\Resources\CashflowResource\Pages;

use App\Filament\Resources\CashflowResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCashflows extends ListRecords
{
    protected static string $resource = CashflowResource::class;



    protected function getHeaderWidgets(): array
    {
        return [
            CashflowResource\Widgets\CashflowStats::class,
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\CreateAction::make(),
        ];
    }
}
