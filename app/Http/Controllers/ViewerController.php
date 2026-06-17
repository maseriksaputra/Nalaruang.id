<?php
namespace App\Http\Controllers;

use App\Models\Invitation;
use Illuminate\Http\Request;

class ViewerController extends Controller
{
    public function show($slug)
    {
        $invitation = Invitation::where('slug', $slug)->firstOrFail();
        
        // Jika user login (admin), izinkan melihat preview draft.
        $isAdmin = auth()->check();

        // Cek status publikasi
        if (!$isAdmin && $invitation->status !== 'published') {
            return view('expired');
        }

        // Cek masa aktif jika ada (expires_at)
        if (!$isAdmin && $invitation->expires_at && now()->greaterThan($invitation->expires_at)) {
            return view('expired');
        }

        // Track visitor if not admin
        if (!$isAdmin) {
            \Illuminate\Support\Facades\DB::table('invitation_visitors')->insert([
                'invitation_id' => $invitation->id,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return view('viewer', compact('invitation'));
    }

    public function submitRsvp(Request $request, $slug)
    {
        $invitation = Invitation::where('slug', $slug)->firstOrFail();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|string',
            'message' => 'nullable|string'
        ]);

        $invitation->rsvps()->create($validated);

        return response()->json(['success' => true, 'message' => 'RSVP berhasil dikirim.']);
    }

    public function getRsvps($slug)
    {
        $invitation = Invitation::where('slug', $slug)->firstOrFail();
        $rsvps = $invitation->rsvps()->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $rsvps]);
    }
}
