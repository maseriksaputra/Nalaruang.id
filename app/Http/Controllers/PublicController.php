<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Invitation;
use App\Models\Template;

class PublicController extends Controller
{
    public function index()
    {
        // Get active services with their active templates to display on the landing page
        $services = \App\Models\Service::with(['templates' => function ($query) {
            $query->where('is_active', true)->orderBy('created_at', 'desc');
        }])->where('is_active', true)->orderBy('sort_order')->get();
        
        $portfolios = \App\Models\Portfolio::where('is_active', true)->orderBy('sort_order')->get();
                                
        return view('landing', compact('services', 'portfolios'));
    }
}
