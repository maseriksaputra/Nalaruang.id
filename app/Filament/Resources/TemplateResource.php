<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TemplateResource\Pages;
use App\Filament\Resources\TemplateResource\RelationManagers;
use App\Models\Template;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Get;
use Filament\Forms\Set;
use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class TemplateResource extends Resource
{
    protected static ?string $model = Template::class;

    protected static ?string $modelLabel = 'Produk';
    protected static ?string $pluralModelLabel = 'Daftar Produk';
    protected static ?string $navigationLabel = 'Produk (Katalog)';
    protected static ?string $navigationGroup = 'Manajemen Toko';
    protected static ?int $navigationSort = 1;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Grid::make(3)
                    ->schema([
                        Forms\Components\Group::make()
                            ->columnSpan(['default' => 3, 'lg' => 2])
                            ->schema([
                                Forms\Components\Section::make('Informasi Dasar')
                                    ->schema([
                                        Forms\Components\Select::make('service_id')
                                            ->relationship('service', 'title')
                                            ->default(function () {
                                                $activeTab = request('activeTab');
                                                if (!$activeTab || $activeTab === 'semua') return null;
                                                
                                                $serviceSlug = null;
                                                switch ($activeTab) {
                                                    case 'cetak_fisik':
                                                        $serviceSlug = 'cetak-fisik-premium';
                                                        break;
                                                    case 'event_digital':
                                                        $serviceSlug = 'event-digital';
                                                        break;
                                                    case 'souvenir':
                                                        $serviceSlug = 'souvenir-merchandise';
                                                        break;
                                                    case 'web_app':
                                                        $serviceSlug = 'web-mobile-app';
                                                        break;
                                                }
                                                
                                                if ($serviceSlug) {
                                                    return \App\Models\Service::where('slug', $serviceSlug)->value('id');
                                                }
                                                return null;
                                            })
                                            ->required()
                                            ->live()
                                            ->afterStateUpdated(function (Set $set) {
                                                $set('category_id', null);
                                                $set('package_id', null);
                                                $set('category', null);
                                            })
                                            ->label('Layanan Utama'),
                                        Forms\Components\Select::make('category_id')
                                            ->relationship('serviceCategory', 'name', fn (Builder $query, Get $get) => $query->where('service_id', $get('service_id')))
                                            ->visible(fn (Get $get) => $get('service_id') ? \App\Models\Category::where('service_id', $get('service_id'))->exists() : false)
                                            ->label('Katalog (Kategori)'),
                                        Forms\Components\Select::make('package_id')
                                            ->relationship('package', 'name', fn (Builder $query, Get $get) => $query->where('service_id', $get('service_id')))
                                            ->visible(fn (Get $get) => $get('service_id') ? \App\Models\Package::where('service_id', $get('service_id'))->exists() : false)
                                            ->label('Paket Harga'),
                                        Forms\Components\Select::make('category')
                                            ->label('Variabel / Sub-Jenis')
                                            ->placeholder('Pilih variabel...')
                                            ->native(true)
                                            ->options(function (Get $get) {
                                                $serviceId = $get('service_id');
                                                if (!$serviceId) return [];

                                                $service = Service::find($serviceId);
                                                $defaults = [];
                                                if ($service) {
                                                    if ($service->slug === 'event-digital') {
                                                        $defaults = ['Animasi' => 'Animasi', 'Simpel' => 'Simpel', 'Elegan' => 'Elegan', 'Premium' => 'Premium'];
                                                    } elseif ($service->slug === 'web-mobile-app') {
                                                        $defaults = ['Company Profile' => 'Company Profile', 'E-Commerce' => 'E-Commerce', 'Sistem Informasi' => 'Sistem Informasi'];
                                                    } elseif ($service->slug === 'cetak-fisik-premium' || $service->slug === 'undangan-cetak' || $service->slug === 'cetak-fisik') {
                                                        $defaults = ['A4' => 'A4', 'A3' => 'A3', 'Laminasi' => 'Laminasi', 'Art Paper' => 'Art Paper', 'HVS' => 'HVS', 'Buku Yasin' => 'Buku Yasin', 'ID Card' => 'ID Card'];
                                                    } elseif ($service->slug === 'souvenir-merchandise') {
                                                        $defaults = ['Lanyard' => 'Lanyard', 'ID Card' => 'ID Card', 'Paket Bundling' => 'Paket Bundling'];
                                                    }
                                                }

                                                $existing = Template::where('service_id', $serviceId)
                                                    ->whereNotNull('category')
                                                    ->where('category', '!=', '')
                                                    ->distinct()
                                                    ->pluck('category', 'category')
                                                    ->toArray();

                                                return array_merge($defaults, $existing);
                                            })
                                            ->helperText('Pilih variabel produk sesuai layanan.'),
                                        Forms\Components\TextInput::make('name')
                                            ->required()
                                            ->label('Nama Produk'),
                                        Forms\Components\TextInput::make('price')
                                            ->numeric()
                                            ->prefix('Rp')
                                            ->label('Harga Asli'),
                                        Forms\Components\TextInput::make('discount_price')
                                            ->numeric()
                                            ->prefix('Rp')
                                            ->label('Harga Diskon (Opsional)')
                                            ->helperText('Jika diisi, Harga Asli akan dicoret.'),
                                        Forms\Components\TextInput::make('stok')
                                            ->numeric()
                                            ->default(999)
                                            ->label('Stok Tersedia')
                                            ->helperText('Biarkan 999 jika stok tidak terbatas.'),
                                    ])->columns(2),

                                Forms\Components\Section::make('Media & Tampilan')
                                    ->schema([
                                        Forms\Components\Select::make('image_aspect_ratio')
                                            ->options([
                                                '1/1' => '1:1 (Square)',
                                                '3/4' => '3:4 (Portrait)',
                                                '4/3' => '4:3 (Landscape)',
                                                '16/9' => '16:9 (Widescreen)',
                                                '9/16' => '9:16 (Story/Reel)',
                                                'auto' => 'Auto (Original)',
                                            ])
                                            ->default('3/4')
                                            ->label('Rasio Aspek Gambar Card'),
                                        Forms\Components\FileUpload::make('image')
                                            ->image()
                                            ->directory('templates')
                                            ->visibility('public')
                                            ->maxSize(10240)
                                            ->label('Gambar Utama (Cover)')
                                            ->helperText('Maks. 10MB'),
                                        Forms\Components\FileUpload::make('images')
                                            ->image()
                                            ->multiple()
                                            ->reorderable()
                                            ->directory('templates')
                                            ->visibility('public')
                                            ->maxSize(10240)
                                            ->label('Galeri Slideshow (Bisa lebih dari 1)')
                                            ->helperText('Maks. 10MB per gambar')
                                            ->columnSpanFull(),
                                    ])->columns(2),

                                Forms\Components\Section::make('Kebutuhan Aset Klien (Form Schema)')
                                    ->description('Tentukan input form yang harus diisi klien setelah memesan produk ini.')
                                    ->schema([
                                        Forms\Components\Repeater::make('form_schema')
                                            ->label('Field Input')
                                            ->schema([
                                                Forms\Components\TextInput::make('field_name')
                                                    ->label('Nama Field (misal: Foto Cover, Nama Panggilan)')
                                                    ->required(),
                                                Forms\Components\Select::make('type')
                                                    ->label('Jenis Input')
                                                    ->options([
                                                        'text' => 'Teks Singkat',
                                                        'textarea' => 'Teks Panjang',
                                                        'image' => 'Upload Gambar/Foto',
                                                    ])
                                                    ->required()
                                                    ->live(),
                                                Forms\Components\Toggle::make('is_required')
                                                    ->label('Wajib Diisi?')
                                                    ->default(true),
                                                Forms\Components\TextInput::make('max_files')
                                                    ->label('Maksimal File (Jika Upload Gambar)')
                                                    ->numeric()
                                                    ->default(1)
                                                    ->visible(fn (Get $get) => $get('type') === 'image'),
                                            ])
                                            ->columns(2)
                                            ->collapsible()
                                            ->defaultItems(0)
                                    ])
                                    ->collapsed(),
                            ]),

                        Forms\Components\Group::make()
                            ->columnSpan(['default' => 3, 'lg' => 1])
                            ->schema([
                                Forms\Components\Section::make('Integrasi Portal')
                                    ->description('Tarik desain otomatis dari builder')
                                    ->schema([
                                        Forms\Components\Select::make('portal_invitation_id')
                                            ->label('Pilih Desain')
                                            ->options(function () {
                                                return \App\Models\Invitation::where('is_template', true)->orderBy('created_at', 'desc')->get(['id', 'title'])->mapWithKeys(function ($inv) {
                                                    return [$inv->id => '#' . $inv->id . ' - ' . ($inv->title ?: 'Desain Tanpa Judul')];
                                                });
                                            })
                                            ->live()
                                            ->afterStateUpdated(function (Set $set, Get $get, $state) {
                                                if ($state) {
                                                    $invitation = \App\Models\Invitation::find($state);
                                                    if ($invitation) {
                                                        if (empty($get('name'))) {
                                                            $set('name', $invitation->title ?: 'Desain Tanpa Judul');
                                                        }
                                                        $set('preview_url', url('/' . $invitation->slug));
                                                        if ($invitation->thumbnail_path) {
                                                            $set('image', $invitation->thumbnail_path);
                                                        }
                                                    }
                                                }
                                            })
                                            ->dehydrated(false)
                                            ->helperText('Otomatis mengisi Link Demo & Nama.'),
                                        Forms\Components\Placeholder::make('portal_preview')
                                            ->label('Live Preview')
                                            ->content(function (Get $get) {
                                                $invitationId = $get('portal_invitation_id');
                                                if (!$invitationId) return new \Illuminate\Support\HtmlString('<span class="text-sm text-gray-500">Pilih desain untuk melihat preview.</span>');
                                                
                                                $invitation = \App\Models\Invitation::find($invitationId);
                                                if (!$invitation) return null;

                                                $url = url('/' . $invitation->slug) . '?preview=1';

                                                return new \Illuminate\Support\HtmlString('
                                                    <div style="width: 100%; height: 371px; overflow: hidden; border: 1px solid #e2e8f0; border-radius: 0.5rem; position: relative; background-color: #f8fafc; display: flex; justify-content: center;">
                                                        <div style="width: 414px; height: 844px; transform: scale(0.44); transform-origin: top center; position: absolute;">
                                                            <iframe src="' . $url . '" style="width: 100%; height: 100%; border: none; pointer-events: none;" tabindex="-1" loading="lazy"></iframe>
                                                        </div>
                                                    </div>
                                                ');
                                            })
                                    ])
                                    ->visible(function (Get $get) {
                                        $serviceId = $get('service_id');
                                        if (!$serviceId) return false;
                                        $service = \App\Models\Service::find($serviceId);
                                        return $service && in_array($service->slug, ['event-digital', 'web-mobile-app']);
                                    }),

                                Forms\Components\Section::make('URL & Pengaturan')
                                    ->schema([
                                        Forms\Components\TextInput::make('preview_url')
                                            ->url()
                                            ->visible(function (Get $get) {
                                                $serviceId = $get('service_id');
                                                if (!$serviceId) return false;
                                                $service = Service::find($serviceId);
                                                return $service && in_array($service->slug, ['event-digital', 'web-mobile-app']);
                                            })
                                            ->label('Link Demo/Preview'),
                                        Forms\Components\TextInput::make('sort_order')
                                            ->numeric()
                                            ->default(0)
                                            ->label('Urutan Tampil'),
                                        Forms\Components\Toggle::make('is_active')
                                            ->required()
                                            ->default(true)
                                            ->label('Status Aktif'),
                                    ]),
                            ]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->withCount('orders'))
            ->defaultSort('created_at', 'desc')
            ->contentGrid([
                'md' => 2,
                'lg' => 3,
                'xl' => 4,
            ])
            ->columns([
                Tables\Columns\Layout\View::make('filament.tables.columns.template-card')
                    ->components([
                        Tables\Columns\TextColumn::make('name')->searchable(),
                        Tables\Columns\TextColumn::make('category')->searchable(),
                        Tables\Columns\TextColumn::make('service.title')->searchable(),
                    ]),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('service_id')
                    ->relationship('service', 'title')
                    ->label('Layanan Induk'),
                Tables\Filters\SelectFilter::make('category_id')
                    ->relationship('serviceCategory', 'name')
                    ->label('Katalog'),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->iconButton()
                    ->color('primary')
                    ->extraAttributes(['style' => 'color: #d81b60;']),
                Tables\Actions\DeleteAction::make()
                    ->iconButton()
                    ->color('danger')
                    ->extraAttributes(['style' => 'margin-left: auto !important;']),
            ])
            ;
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
            'index' => Pages\ListTemplates::route('/'),
            'create' => Pages\CreateTemplate::route('/create'),
            'edit' => Pages\EditTemplate::route('/{record}/edit'),
        ];
    }
}
