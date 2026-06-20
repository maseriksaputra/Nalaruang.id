<?php

namespace App\Filament\Studio\Resources\PhotoSessionResource\Pages;

use App\Filament\Studio\Resources\PhotoSessionResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPhotoSessions extends ListRecords
{
    protected static string $resource = PhotoSessionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
