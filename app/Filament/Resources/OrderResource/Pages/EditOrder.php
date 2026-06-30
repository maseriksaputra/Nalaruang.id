<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditOrder extends EditRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('generate_form_link')
                ->label('Generate Link Form')
                ->icon('heroicon-o-link')
                ->color('success')
                ->visible(fn ($record) => empty($record->form_token))
                ->action(function ($record) {
                    $record->form_token = \Illuminate\Support\Str::random(32);
                    $record->save();
                    \Filament\Notifications\Notification::make()
                        ->title('Link Form Berhasil Dibuat')
                        ->success()
                        ->send();
                }),
            Actions\DeleteAction::make(),
        ];
    }
}
