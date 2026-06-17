<?php
$t = \App\Models\Template::where('name', 'Minimalist White')->first();
if ($t) {
    $t->price = 50000;
    $t->discount_price = 20000;
    $t->save();
    echo 'Discount added to: ' . $t->name;
}
