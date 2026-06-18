<?php

namespace App\Filament\Resources\CashierProductResource\Pages;

use App\Filament\Resources\CashierProductResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCashierProducts extends ListRecords
{
    protected static string $resource = CashierProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
