<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\HeroSlide;
use App\Models\Portfolio;
use App\Models\Service;
use App\Models\Testimonial;

class HomeController extends Controller
{
    public function index()
    {
        // Track generic server visit
        \Illuminate\Support\Facades\DB::table('invitation_visitors')->insert([
            'invitation_id' => null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $heroSlides = HeroSlide::where('is_active', true)->orderBy('sort_order')->get();
        $services = Service::with(['templates' => function ($query) {
            $query->where('is_active', true)->orderBy('sort_order')->orderBy('price', 'asc');
        }])->where('is_active', true)->orderBy('sort_order')->get();
        $portfolios = Portfolio::where('is_active', true)->orderBy('sort_order')->get();
        $testimonials = Testimonial::where('is_active', true)->orderBy('sort_order')->get();

        return view('home', compact('heroSlides', 'services', 'portfolios', 'testimonials'));
    }
}
