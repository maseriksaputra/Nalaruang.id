<?php

namespace App\Filament\Resources\CashflowResource\Pages;

use App\Filament\Resources\CashflowResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCashflow extends EditRecord
{
    protected static string $resource = CashflowResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
