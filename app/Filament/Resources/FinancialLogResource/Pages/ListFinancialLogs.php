<?php

namespace App\Filament\Resources\FinancialLogResource\Pages;

use App\Filament\Resources\FinancialLogResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListFinancialLogs extends ListRecords
{
    protected static string $resource = FinancialLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
