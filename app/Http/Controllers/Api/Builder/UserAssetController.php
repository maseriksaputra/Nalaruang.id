<?php

namespace App\Http\Controllers\Api\Builder;

use App\Http\Controllers\Controller;
use App\Models\UserAsset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserAssetController extends Controller
{
    public function index(Request $request)
    {
        $assets = UserAsset::where('user_id', auth()->id())->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $assets
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,svg,webp,mp4,mov,webm,ogg|max:51200', // Max 50MB
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $disk = config('filesystems.default');
            $path = $file->storePublicly('user_assets', $disk);
            
            $type = str_starts_with($file->getMimeType(), 'video/') ? 'video' : 'image';

            $asset = UserAsset::create([
                'user_id' => auth()->id(),
                'name' => $file->getClientOriginalName(),
                'type' => $type,
                'url' => Storage::disk($disk)->url($path),
            ]);

            return response()->json([
                'success' => true,
                'data' => $asset,
                'url' => $asset->url
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }

    public function destroy($id)
    {
        $asset = UserAsset::where('user_id', auth()->id())->findOrFail($id);
        
        $disk = config('filesystems.default');
        
        // Coba hapus file fisik dengan ekstrak path (untuk s3 atau public)
        $path = str_replace(Storage::disk($disk)->url(''), '', $asset->url);
        
        if (Storage::disk($disk)->exists($path)) {
            Storage::disk($disk)->delete($path);
        }

        $asset->delete();

        return response()->json([
            'success' => true,
            'message' => 'Asset deleted successfully'
        ]);
    }
}
