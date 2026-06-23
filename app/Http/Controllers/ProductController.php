<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Template;

class ProductController extends Controller
{
    public function show($id)
    {
        $product = Template::with(['service', 'serviceCategory', 'package'])->withCount('orders')->findOrFail($id);
        
        // Track views for non-admin visitors
        $isAdmin = auth()->check();
        if (!$isAdmin) {
            $product->increment('demo_views');
        }

        return view('product-detail', compact('product'));
    }

    public function share($id)
    {
        $product = Template::findOrFail($id);
        $product->increment('shares');
        
        return response()->json(['success' => true, 'shares' => $product->shares]);
    }
}
