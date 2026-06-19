<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Invitation;
use App\Models\Template;

class PublicController extends Controller
{
    public function index()
    {
        // Auto-fix for Service name "Undangan Cetak" -> "Cetak Fisik Premium"
        $cetakFisik = \App\Models\Service::whereIn('slug', ['undangan-cetak', 'cetak-fisik', 'cetak-fisik-premium'])->first();
        if ($cetakFisik) {
            $cetakFisik->update([
                'title' => 'Cetak Fisik Premium',
                'slug' => 'cetak-fisik-premium'
            ]);
            
            // Rescue any orphaned templates that might have been assigned to an old service ID
            $oldServices = \App\Models\Service::whereIn('slug', ['undangan-cetak', 'cetak-fisik'])->where('id', '!=', $cetakFisik->id)->get();
            foreach ($oldServices as $old) {
                \App\Models\Template::where('service_id', $old->id)->update(['service_id' => $cetakFisik->id]);
                \App\Models\Category::where('service_id', $old->id)->update(['service_id' => $cetakFisik->id]);
                \App\Models\Package::where('service_id', $old->id)->update(['service_id' => $cetakFisik->id]);
                $old->delete();
            }
        } else {
            \App\Models\Service::firstOrCreate(
                ['slug' => 'cetak-fisik-premium'],
                ['title' => 'Cetak Fisik Premium', 'description' => 'Layanan cetak undangan premium.', 'is_active' => true, 'sort_order' => 2]
            );
        }

        // Get active services with their active templates to display on the landing page
        $services = \App\Models\Service::with(['templates' => function ($query) {
            $query->where('is_active', true)->orderBy('created_at', 'desc');
        }])->where('is_active', true)->orderBy('sort_order')->get();
        
        $portfolios = \App\Models\Portfolio::where('is_active', true)->orderBy('sort_order')->get();
                                
        return view('landing', compact('services', 'portfolios'));
    }
}
