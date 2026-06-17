<?php

namespace App\Http\Controllers\Api\Builder;

use App\Http\Controllers\Controller;
use App\Models\Invitation;
use Illuminate\Http\Request;

class InvitationController extends Controller
{
    /**
     * Endpoint untuk Auto-Save JSON Kanvas
     */
    public function autoSave(Request $request, Invitation $invitation)
    {
        // Validasi dasar memastikan payload JSON valid
        $validated = $request->validate([
            'canvas_config' => 'required|array',
            'canvas_config.sections' => 'required|array',
            'canvas_config.global_settings' => 'required|array',
        ]);

        // Berkat AsArrayObject casting di Model, Laravel akan mengonversi
        // array ini menjadi JSON string secara otomatis di database.
        $invitation->update([
            'canvas_config' => $validated['canvas_config']
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Canvas auto-saved successfully.',
            'last_saved_at' => $invitation->updated_at->toDateTimeString()
        ]);
    }
}
