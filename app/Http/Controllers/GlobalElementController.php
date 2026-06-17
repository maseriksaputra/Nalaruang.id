<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GlobalElement;

class GlobalElementController extends Controller
{
    public function index()
    {
        $elements = GlobalElement::latest()->get();
        return response()->json([
            'success' => true,
            'data' => $elements
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'category' => 'nullable|string',
            'payload' => 'required|array'
        ]);

        $element = GlobalElement::create([
            'name' => $request->name,
            'type' => $request->type,
            'category' => $request->category ?? 'general',
            'thumbnail_url' => $request->thumbnail_url ?? null,
            'payload' => $request->payload
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Element saved successfully',
            'data' => $element
        ]);
    }

    public function uploadMedia(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:20480', // Max 20MB
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        // Simpan di public/uploads
        $file->move(public_path('uploads'), $filename);

        $url = '/uploads/' . $filename;

        return response()->json([
            'success' => true,
            'url' => $url,
            'filename' => $filename
        ]);
    }

    public function destroy($id)
    {
        $element = GlobalElement::findOrFail($id);
        $element->delete();

        return response()->json([
            'success' => true,
            'message' => 'Element deleted successfully'
        ]);
    }
}
