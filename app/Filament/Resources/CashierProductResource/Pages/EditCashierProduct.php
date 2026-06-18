<?php

namespace App\Filament\Resources\CashierProductResource\Pages;

use App\Filament\Resources\CashierProductResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCashierProduct extends EditRecord
{
    protected static string $resource = CashierProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
