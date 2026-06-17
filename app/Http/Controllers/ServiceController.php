<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function show($slug)
    {
        $service = \App\Models\Service::with(['packages', 'categories.templates' => function($q) {
            $q->where('is_active', true)->orderBy('sort_order')->orderBy('price', 'asc');
        }, 'templates' => function($q) {
            // fallback for services without categories
            $q->where('is_active', true)->orderBy('sort_order')->orderBy('price', 'asc');
        }])->where('slug', $slug)->firstOrFail();
        
        return view('service-show', compact('service'));
    }
}
