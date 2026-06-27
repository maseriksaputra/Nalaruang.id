<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\ProductPrice;
use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductPriceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure Cetak Fisik Service exists
        $cetakFisikService = Service::firstOrCreate(
            ['title' => 'Cetak Fisik Premium'],
            [
                'category' => 'Cetak Fisik',
                'description' => 'Layanan cetak fisik berkualitas tinggi',
                'is_active' => true,
                'sort_order' => 1
            ]
        );

        // 2. Ensure F&B Service exists
        $fnbService = Service::firstOrCreate(
            ['title' => 'F&B (Food & Beverage)'],
            [
                'category' => 'F&B',
                'description' => 'Layanan makanan dan minuman',
                'is_active' => true,
                'sort_order' => 5
            ]
        );

        // Optional: Create specific categories if needed
        $cetakFotoCategory = Category::firstOrCreate(
            ['name' => 'Cetak Foto', 'service_id' => $cetakFisikService->id],
            ['slug' => 'cetak-foto', 'description' => 'Cetak foto berbagai ukuran']
        );

        $minumanCategory = Category::firstOrCreate(
            ['name' => 'Minuman', 'service_id' => $fnbService->id],
            ['slug' => 'minuman', 'description' => 'Berbagai macam minuman segar']
        );

        // 3. Seed Cetak Foto Prices
        $photoPrices = [
            ['name' => '2x3', 'description' => '2 x 3 cm', 'price' => 1000],
            ['name' => '3x4', 'description' => '3 x 4 cm', 'price' => 1000],
            ['name' => '4x6', 'description' => '4 x 6 cm', 'price' => 2000],
            ['name' => '2R', 'description' => '6,35 x 8,89 cm', 'price' => 2000],
            ['name' => '3R', 'description' => '8,89 x 12,7 cm', 'price' => 3000],
            ['name' => '4R', 'description' => '10,16 x 15,24 cm', 'price' => 5000],
            ['name' => '5R', 'description' => '12,7 x 17,78 cm', 'price' => 7000],
            ['name' => '8R', 'description' => '20,32 x 25,40 cm', 'price' => 10000],
            ['name' => 'A4', 'description' => '21 x 29,7 cm', 'price' => 10000],
            ['name' => '10R', 'description' => '25,4 x 30,48 cm', 'price' => 15000],
        ];

        foreach ($photoPrices as $price) {
            ProductPrice::updateOrCreate(
                [
                    'service_id' => $cetakFisikService->id,
                    'category_id' => $cetakFotoCategory->id,
                    'name' => $price['name']
                ],
                [
                    'description' => $price['description'],
                    'price' => $price['price'],
                    'is_active' => true
                ]
            );
        }

        // 4. Seed F&B Prices
        $fnbPrices = [
            ['name' => 'Es Teh Manis', 'description' => 'Es teh manis segar', 'price' => 3000],
            ['name' => 'Kopi Hitam', 'description' => 'Kopi hitam panas', 'price' => 4000],
        ];

        foreach ($fnbPrices as $price) {
            ProductPrice::updateOrCreate(
                [
                    'service_id' => $fnbService->id,
                    'category_id' => $minumanCategory->id,
                    'name' => $price['name']
                ],
                [
                    'description' => $price['description'],
                    'price' => $price['price'],
                    'is_active' => true
                ]
            );
        }
    }
}
