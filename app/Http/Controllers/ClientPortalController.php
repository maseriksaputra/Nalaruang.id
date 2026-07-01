<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Invitation;

class ClientPortalController extends Controller
{
    public function show($slug)
    {
        $invitation = Invitation::where('slug', $slug)->firstOrFail();
        // Cek status publikasi
        if ($invitation->status !== 'published') {
            return view('expired');
        }
        
        $links = \App\Models\GuestLink::where('invitation_id', $invitation->id)->orderBy('created_at', 'desc')->get();
        $rsvps = \App\Models\Rsvp::where('invitation_id', $invitation->id)->orderBy('created_at', 'desc')->get();
        
        // Traffic Data
        $totalViews = \Illuminate\Support\Facades\DB::table('invitation_visitors')
            ->where('invitation_id', $invitation->id)
            ->count();
        
        // Aggregate by date for the last 30 days
        $startDate = now()->subDays(29)->startOfDay();
        
        $dailyTraffic = \Illuminate\Support\Facades\DB::table('invitation_visitors')
            ->where('invitation_id', $invitation->id)
            ->where('created_at', '>=', $startDate)
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');
            
        $trafficData = [];
        $trafficLabels = [];
        for ($i = 29; $i >= 0; $i--) {
            $dateStr = now()->subDays($i)->format('Y-m-d');
            $trafficLabels[] = now()->subDays($i)->format('d M');
            $trafficData[] = isset($dailyTraffic[$dateStr]) ? $dailyTraffic[$dateStr] : 0;
        }
        
        return view('client-portal', compact('invitation', 'links', 'rsvps', 'totalViews', 'trafficLabels', 'trafficData'));
    }

    public function storeBatchGuestLinks(Request $request, $slug)
    {
        $invitation = Invitation::where('slug', $slug)->firstOrFail();
        
        $request->validate([
            'guest_names' => 'required|string'
        ]);

        // Pisahkan berdasarkan koma atau baris baru
        $names = preg_split('/[\n,]+/', $request->guest_names);
        
        foreach ($names as $name) {
            $name = trim($name);
            if (!empty($name)) {
                // Cek apakah sudah ada untuk menghindari duplikat (opsional)
                \App\Models\GuestLink::firstOrCreate([
                    'invitation_id' => $invitation->id,
                    'guest_name' => $name
                ]);
            }
        }

        return redirect()->back()->with('success', 'Berhasil menambahkan daftar tamu.');
    }

    public function updateGreeting(Request $request, $slug)
    {
        $invitation = Invitation::where('slug', $slug)->firstOrFail();
        
        $request->validate([
            'whatsapp_greeting' => 'nullable|string'
        ]);

        $invitation->whatsapp_greeting = $request->whatsapp_greeting;
        $invitation->save();

        return redirect()->back()->with('success', 'Template ucapan WhatsApp berhasil disimpan.');
    }

    public function deleteGuestLink($slug, $id)
    {
        $invitation = Invitation::where('slug', $slug)->firstOrFail();
        $link = \App\Models\GuestLink::where('invitation_id', $invitation->id)->findOrFail($id);
        
        $link->delete();

        return redirect()->back()->with('success', 'Tamu berhasil dihapus dari daftar.');
    }

    public function exportRsvps($slug)
    {
        $invitation = Invitation::where('slug', $slug)->firstOrFail();
        $rsvps = \App\Models\Rsvp::where('invitation_id', $invitation->id)->orderBy('created_at', 'desc')->get();
        
        $filename = "Buku_Tamu_{$slug}_" . date('Ymd_His') . ".csv";
        
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];
        
        $columns = ['Tanggal', 'Nama', 'Kehadiran', 'Ucapan / Komentar'];
        
        $callback = function() use($rsvps, $columns) {
            $file = fopen('php://output', 'w');
            
            // Add BOM (Byte Order Mark) to fix UTF-8 in Excel
            fputs($file, $bom =(chr(0xEF) . chr(0xBB) . chr(0xBF)));
            
            fputcsv($file, $columns);
            
            foreach ($rsvps as $rsvp) {
                $status = 'Mungkin Hadir';
                if ($rsvp->status === 'attending') {
                    $status = 'Hadir';
                } elseif ($rsvp->status === 'not_attending') {
                    $status = 'Tidak Hadir';
                }
                
                fputcsv($file, [
                    $rsvp->created_at->format('d/m/Y H:i'),
                    $rsvp->name,
                    $status,
                    $rsvp->message
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
}
