<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GlobalElement;

class GlobalElementController extends Controller
{
    public function index()
    {
        // Ambil elemen global (bawaan sistem yang user_id = null) DAN elemen milik user ini
        $elements = GlobalElement::where('user_id', auth()->id())
            ->orWhereNull('user_id')
            ->latest()
            ->get();
            
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
            'user_id' => auth()->id(),
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
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,svg,webp,mp4,mov,webm,ogg,mp3,wav,json,txt|max:51200', // Max 50MB
        ]);

        $file = $request->file('file');
        $disk = config('filesystems.default');
        
        // Kompresi sederhana menggunakan GD jika berupa gambar
        $mimeType = $file->getMimeType();
        $extension = strtolower($file->getClientOriginalExtension());
        $path = '';

        if (str_starts_with($mimeType, 'image/') && in_array($extension, ['jpg', 'jpeg', 'png', 'webp'])) {
            $sourceImage = null;
            if (in_array($mimeType, ['image/jpeg', 'image/jpg'])) $sourceImage = @imagecreatefromjpeg($file->getPathname());
            elseif ($mimeType == 'image/png') $sourceImage = @imagecreatefrompng($file->getPathname());
            elseif ($mimeType == 'image/webp') $sourceImage = @imagecreatefromwebp($file->getPathname());

            if ($sourceImage !== false) {
                $tempPath = tempnam(sys_get_temp_dir(), 'cmp_');
                
                // Pertahankan transparansi
                if ($mimeType == 'image/png' || $mimeType == 'image/webp') {
                    imagepalettetotruecolor($sourceImage);
                    imagealphablending($sourceImage, false);
                    imagesavealpha($sourceImage, true);
                }

                // Simpan dengan kompresi
                if ($mimeType == 'image/png') {
                    imagepng($sourceImage, $tempPath, 7); // Kompresi level 7 (0-9)
                } elseif ($mimeType == 'image/webp') {
                    imagewebp($sourceImage, $tempPath, 70); // Kualitas 70
                } else {
                    imagejpeg($sourceImage, $tempPath, 70); // Kualitas 70
                }
                
                imagedestroy($sourceImage);

                $filename = \Illuminate\Support\Str::random(40) . '.' . $extension;
                $path = 'global_elements_media/' . $filename;
                
                \Illuminate\Support\Facades\Storage::disk($disk)->put($path, file_get_contents($tempPath), 'public');
                @unlink($tempPath);
            } else {
                $path = $file->storePublicly('global_elements_media', $disk);
            }
        } else {
            // Simpan normal
            $path = $file->storePublicly('global_elements_media', $disk);
        }

        // Dapatkan URL yang benar (S3 URL atau local URL)
        $url = \Illuminate\Support\Facades\Storage::disk($disk)->url($path);

        return response()->json([
            'success' => true,
            'url' => $url
        ]);
    }

    public function destroy($id)
    {
        $element = GlobalElement::where(function($query) {
            $query->where('user_id', auth()->id())
                  ->orWhereNull('user_id');
        })->findOrFail($id);
        
        $element->delete();

        return response()->json([
            'success' => true,
            'message' => 'Element deleted successfully'
        ]);
    }
}
