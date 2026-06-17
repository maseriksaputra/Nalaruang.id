<?php

namespace App\Filament\Resources\InvitationVisitorResource\Pages;

use App\Filament\Resources\InvitationVisitorResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditInvitationVisitor extends EditRecord
{
    protected static string $resource = InvitationVisitorResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
