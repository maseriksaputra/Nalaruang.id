<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Pages\Page;
use Filament\Actions\Action;
use Filament\Notifications\Notification;

class ManageBepSettings extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';
    protected static ?string $navigationGroup = 'Transaksi & Keuangan';
    protected static string $view = 'filament.pages.manage-bep-settings';
    protected static ?string $title = 'Pengaturan BEP';
    protected static ?int $navigationSort = 3;

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'bep_total_target' => Setting::get('bep_total_target', 10000000),
            'bep_daily_target' => Setting::get('bep_daily_target', 30000),
            'bep_start_date' => Setting::get('bep_start_date', now()->format('Y-m-d')),
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('bep_total_target')
                    ->label('Total Target Balik Modal (BEP)')
                    ->numeric()
                    ->required()
                    ->prefix('Rp'),
                TextInput::make('bep_daily_target')
                    ->label('Target Potongan Harian')
                    ->numeric()
                    ->required()
                    ->prefix('Rp'),
                DatePicker::make('bep_start_date')
                    ->label('Tanggal Mulai Perhitungan')
                    ->required(),
            ])
            ->statePath('data');
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan')
                ->submit('save'),
        ];
    }

    public function save(): void
    {
        $data = $this->form->getState();

        Setting::set('bep_total_target', $data['bep_total_target']);
        Setting::set('bep_daily_target', $data['bep_daily_target']);
        Setting::set('bep_start_date', $data['bep_start_date']);

        Notification::make()
            ->title('Pengaturan berhasil disimpan')
            ->success()
            ->send();
    }
}
