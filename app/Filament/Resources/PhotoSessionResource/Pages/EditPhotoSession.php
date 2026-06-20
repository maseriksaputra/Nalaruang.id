<?php

namespace App\Filament\Resources\PhotoSessionResource\Pages;

use App\Filament\Resources\PhotoSessionResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPhotoSession extends EditRecord
{
    protected static string $resource = PhotoSessionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
