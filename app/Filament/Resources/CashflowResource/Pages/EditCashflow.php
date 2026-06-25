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

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Jika user secara manual mengedit potongan otomatis, ubah reference-nya
        // agar tidak ditimpa lagi oleh sistem sinkronisasi otomatis
        if ($this->record->reference_type === 'AUTO_BEP') {
            $data['reference_type'] = 'AUTO_BEP_EDITED';
        }

        return $data;
    }
}
