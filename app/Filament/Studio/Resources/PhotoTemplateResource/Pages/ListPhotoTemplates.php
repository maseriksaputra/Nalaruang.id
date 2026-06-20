<?php

namespace App\Filament\Studio\Resources\PhotoTemplateResource\Pages;

use App\Filament\Studio\Resources\PhotoTemplateResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPhotoTemplates extends ListRecords
{
    protected static string $resource = PhotoTemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
