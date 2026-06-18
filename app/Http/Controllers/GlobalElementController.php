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
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,svg,webp,mp4,mov,webm,ogg,mp3,wav|max:51200', // Max 50MB
        ]);

        $file = $request->file('file');
        $disk = config('filesystems.default');
        
        // Simpan ke storage sesuai disk default (S3 atau local) secara publik
        $path = $file->storePublicly('global_elements_media', $disk);

        // Dapatkan URL yang benar (S3 URL atau local URL)
        $url = \Illuminate\Support\Facades\Storage::disk($disk)->url($path);

        return response()->json([
            'success' => true,
            'url' => $url
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
