<?php

namespace App\Filament\Resources\ProductPriceResource\Pages;

use App\Filament\Resources\ProductPriceResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateProductPrice extends CreateRecord
{
    protected static string $resource = ProductPriceResource::class;
}
