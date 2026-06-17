<?php

namespace App\Filament\Resources\InvitationVisitorResource\Pages;

use App\Filament\Resources\InvitationVisitorResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListInvitationVisitors extends ListRecords
{
    protected static string $resource = InvitationVisitorResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
