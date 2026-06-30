<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    protected static ?string $navigationGroup = 'Transaksi & Keuangan';
    protected static ?string $modelLabel = 'Pesanan Masuk';
    protected static ?string $pluralModelLabel = 'Daftar Pesanan';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informasi Pesanan')
                    ->schema([
                        Forms\Components\Select::make('template_id')
                            ->relationship('template', 'name')
                            ->searchable()
                            ->required(function (\Filament\Forms\Get $get) {
                                $packageId = $get('package_id');
                                if (!$packageId) return true;
                                $package = \App\Models\Package::find($packageId);
                                return !($package && strtolower(trim($package->name)) === 'custom vip');
                            }),
                        Forms\Components\Select::make('package_id')
                            ->relationship('package', 'name')
                            ->searchable()
                            ->live(),
                        Forms\Components\TextInput::make('customer_name')
                            ->required(),
                        Forms\Components\TextInput::make('customer_phone')
                            ->tel()
                            ->required(),
                        Forms\Components\DatePicker::make('event_date'),
                        Forms\Components\Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'diproses' => 'Diproses',
                                'selesai' => 'Selesai',
                                'dibatalkan' => 'Dibatalkan',
                                'revisi' => 'Revisi',
                            ])
                            ->required(),
                        Forms\Components\TextInput::make('total_price')
                            ->numeric()
                            ->prefix('Rp'),
                        Forms\Components\Textarea::make('guest_list')
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('custom_requests')
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Akses Form Klien (Auto-Generate Project)')
                    ->schema([
                        Forms\Components\TextInput::make('form_status')
                            ->label('Status Form Klien')
                            ->disabled()
                            ->default('pending'),
                        Forms\Components\Placeholder::make('form_link')
                            ->label('Link Form (Untuk dikirim ke Klien)')
                            ->content(function ($record) {
                                if (!$record || !$record->form_token) return '-';
                                $url = url('/client/form/' . $record->form_token);
                                return new \Illuminate\Support\HtmlString('<a href="'.$url.'" target="_blank" class="text-primary-600 underline">'.$url.'</a>');
                            }),
                    ])->columns(2),

                Forms\Components\Section::make('Kebutuhan Aset Klien (Khusus Custom VIP)')
                    ->description('Tentukan input form yang harus diisi klien secara kustom.')
                    ->schema([
                        Forms\Components\Repeater::make('custom_form_schema')
                            ->label('Field Input')
                            ->schema([
                                Forms\Components\TextInput::make('field_name')
                                    ->label('Nama Field (misal: Foto Cover, Rekening)')
                                    ->required(),
                                Forms\Components\Select::make('type')
                                    ->label('Jenis Input')
                                    ->options([
                                        'text' => 'Teks Singkat',
                                        'textarea' => 'Teks Panjang',
                                        'date' => 'Tanggal Saja',
                                        'datetime' => 'Tanggal & Waktu',
                                        'image' => 'Upload Media (Gambar & Video)',
                                        'audio' => 'Upload Musik/Audio',
                                    ])
                                    ->required()
                                    ->live(),
                                Forms\Components\Toggle::make('is_required')
                                    ->label('Wajib Diisi?')
                                    ->default(true),
                                Forms\Components\TextInput::make('max_files')
                                    ->label('Maksimal File (Upload Media)')
                                    ->numeric()
                                    ->default(1)
                                    ->visible(fn (\Filament\Forms\Get $get) => in_array($get('type'), ['image', 'audio'])),
                            ])
                            ->columns(2)
                            ->collapsible()
                            ->default([
                                ['field_name' => 'Nama Mempelai Pria (Lengkap)', 'type' => 'text', 'is_required' => true],
                                ['field_name' => 'Nama Panggilan Mempelai Pria', 'type' => 'text', 'is_required' => true],
                                ['field_name' => 'Nama Orang Tua Mempelai Pria & Anak Keberapa', 'type' => 'textarea', 'is_required' => false],
                                ['field_name' => 'Nama Mempelai Wanita (Lengkap)', 'type' => 'text', 'is_required' => true],
                                ['field_name' => 'Nama Panggilan Mempelai Wanita', 'type' => 'text', 'is_required' => true],
                                ['field_name' => 'Nama Orang Tua Mempelai Wanita & Anak Keberapa', 'type' => 'textarea', 'is_required' => false],
                                ['field_name' => 'Tanggal & Waktu Acara Utama', 'type' => 'datetime', 'is_required' => true],
                                ['field_name' => 'Lokasi Acara Utama', 'type' => 'textarea', 'is_required' => true],
                                ['field_name' => 'Tanggal & Waktu Akad Nikah', 'type' => 'datetime', 'is_required' => false],
                                ['field_name' => 'Tempat Akad Nikah', 'type' => 'textarea', 'is_required' => false],
                                ['field_name' => 'Tanggal & Waktu Resepsi', 'type' => 'datetime', 'is_required' => false],
                                ['field_name' => 'Tempat Resepsi', 'type' => 'textarea', 'is_required' => false],
                                ['field_name' => 'Informasi Rekening / Amplop Digital', 'type' => 'textarea', 'is_required' => false],
                                ['field_name' => 'Kisah Cinta / Narasi / Ucapan', 'type' => 'textarea', 'is_required' => false],
                                ['field_name' => 'Galeri Foto & Video', 'type' => 'image', 'is_required' => false, 'max_files' => 50],
                                ['field_name' => 'Musik / Backsound (Opsional)', 'type' => 'audio', 'is_required' => false],
                                ['field_name' => 'Request Desain Spesifik / Catatan', 'type' => 'textarea', 'is_required' => false],
                            ])
                            ->afterStateHydrated(function (Forms\Components\Repeater $component, $state) {
                                if (empty($state)) {
                                    $component->state([
                                        ['field_name' => 'Nama Mempelai Pria (Lengkap)', 'type' => 'text', 'is_required' => true],
                                        ['field_name' => 'Nama Panggilan Mempelai Pria', 'type' => 'text', 'is_required' => true],
                                        ['field_name' => 'Nama Orang Tua Mempelai Pria & Anak Keberapa', 'type' => 'textarea', 'is_required' => false],
                                        ['field_name' => 'Nama Mempelai Wanita (Lengkap)', 'type' => 'text', 'is_required' => true],
                                        ['field_name' => 'Nama Panggilan Mempelai Wanita', 'type' => 'text', 'is_required' => true],
                                        ['field_name' => 'Nama Orang Tua Mempelai Wanita & Anak Keberapa', 'type' => 'textarea', 'is_required' => false],
                                        ['field_name' => 'Tanggal & Waktu Acara Utama', 'type' => 'datetime', 'is_required' => true],
                                        ['field_name' => 'Lokasi Acara Utama', 'type' => 'textarea', 'is_required' => true],
                                        ['field_name' => 'Tanggal & Waktu Akad Nikah', 'type' => 'datetime', 'is_required' => false],
                                        ['field_name' => 'Tempat Akad Nikah', 'type' => 'textarea', 'is_required' => false],
                                        ['field_name' => 'Tanggal & Waktu Resepsi', 'type' => 'datetime', 'is_required' => false],
                                        ['field_name' => 'Tempat Resepsi', 'type' => 'textarea', 'is_required' => false],
                                        ['field_name' => 'Informasi Rekening / Amplop Digital', 'type' => 'textarea', 'is_required' => false],
                                        ['field_name' => 'Kisah Cinta / Narasi / Ucapan', 'type' => 'textarea', 'is_required' => false],
                                        ['field_name' => 'Galeri Foto & Video', 'type' => 'image', 'is_required' => false, 'max_files' => 50],
                                        ['field_name' => 'Musik / Backsound (Opsional)', 'type' => 'audio', 'is_required' => false],
                                        ['field_name' => 'Request Desain Spesifik / Catatan', 'type' => 'textarea', 'is_required' => false],
                                    ]);
                                }
                            })
                    ])
                    ->visible(function (\Filament\Forms\Get $get) {
                        $packageId = $get('package_id');
                        if (!$packageId) return false;
                        $package = \App\Models\Package::find($packageId);
                        return $package && strtolower(trim($package->name)) === 'custom vip';
                    })
                    ->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('customer_name')
                    ->label('Nama Klien')
                    ->searchable(),
                Tables\Columns\TextColumn::make('template.name')
                    ->label('Produk')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'primary' => fn ($state) => in_array($state, ['diproses', 'revisi']),
                        'success' => 'selesai',
                        'danger' => 'dibatalkan',
                    ]),
                Tables\Columns\BadgeColumn::make('form_status')
                    ->label('Status Form')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'submitted',
                    ]),
                Tables\Columns\TextColumn::make('total_price')
                    ->numeric()
                    ->sortable()
                    ->prefix('Rp '),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('buka_builder')
                    ->label(fn ($record) => $record->invitation_id ? 'Buka Builder' : 'Buat Projek')
                    ->icon('heroicon-o-paint-brush')
                    ->color(fn ($record) => $record->invitation_id ? 'success' : 'primary')
                    ->url(function ($record) {
                        if ($record->invitation_id) {
                            return url('/admin/builder/' . $record->invitation_id . '?order_id=' . $record->id);
                        }
                        return null; // Handled by action callback
                    })
                    ->openUrlInNewTab(fn ($record) => (bool)$record->invitation_id)
                    ->action(function ($record) {
                        if ($record->invitation_id) {
                            // If URL handles it, action doesn't run, but just in case
                            return;
                        }
                        
                        $template = $record->template;
                        if (!$template || !$template->invitation_id) {
                            if (strtolower(trim($record->package?->name)) === 'custom vip') {
                                $newTitle = 'Projek Klien: ' . $record->customer_name;
                                $newInvitation = \App\Models\Invitation::create([
                                    'user_id' => auth()->id() ?? 2,
                                    'order_id' => $record->id,
                                    'title' => $newTitle,
                                    'slug' => \Illuminate\Support\Str::uuid()->toString(),
                                    'status' => 'draft',
                                    'canvas_config' => json_encode(['width' => 414, 'height' => 736, 'background' => '#ffffff', 'objects' => []]),
                                    'is_template' => false
                                ]);

                                $record->invitation_id = $newInvitation->id;
                                $record->save();

                                redirect(url('/admin/builder/' . $newInvitation->id . '?order_id=' . $record->id));
                                return;
                            }

                            \Filament\Notifications\Notification::make()
                                ->title('Template Error')
                                ->body('Produk ini tidak terhubung dengan desain template builder apapun.')
                                ->danger()
                                ->send();
                            return;
                        }

                        $sourceInvitation = \App\Models\Invitation::find($template->invitation_id);
                        if (!$sourceInvitation) {
                            \Filament\Notifications\Notification::make()
                                ->title('Desain Hilang')
                                ->body('Desain asli untuk template ini sudah dihapus.')
                                ->danger()
                                ->send();
                            return;
                        }

                        // Duplicate it
                        $newTitle = 'Projek Klien: ' . $record->customer_name;
                        $newInvitation = \App\Models\Invitation::create([
                            'user_id' => auth()->id() ?? 2,
                            'title' => $newTitle,
                            'slug' => \Illuminate\Support\Str::uuid()->toString(),
                            'status' => 'draft',
                            'canvas_config' => $sourceInvitation->canvas_config,
                            'is_template' => false
                        ]);

                        $record->invitation_id = $newInvitation->id;
                        $record->save();

                        // Redirect to builder
                        redirect(url('/admin/builder/' . $newInvitation->id . '?order_id=' . $record->id));
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
