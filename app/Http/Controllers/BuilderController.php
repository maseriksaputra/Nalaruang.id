<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use Illuminate\Http\Request;

class BuilderController extends Controller
{
    public function show($id)
    {
        $invitation = Invitation::findOrFail($id);

        // Auto-clean massive payloads to prevent crashes and unblock users
        $config = $invitation->canvas_config;
        $modified = false;
        
        if (is_array($config) && isset($config['sections'])) {
            foreach ($config['sections'] as &$section) {
                if (isset($section['layers']) && is_array($section['layers'])) {
                    foreach ($section['layers'] as $layerIndex => &$layer) {
                        $layerSize = strlen(json_encode($layer));
                        if ($layerSize > 5000000) {
                            if (isset($layer['content']) && is_string($layer['content']) && strlen($layer['content']) > 5000000) { 
                                $layer['content'] = ''; 
                            }
                            $modified = true;
                        }
                    }
                }
            }
        }

        // Clean global_settings
        if (is_array($config) && isset($config['global_settings'])) {
            $globalSize = strlen(json_encode($config['global_settings']));
            if ($globalSize > 5000000) {
                foreach ($config['global_settings'] as $key => &$value) {
                    if (is_string($value)) {
                        if (strlen($value) > 5000000) {
                            $value = "";
                            $modified = true;
                        }
                    } elseif (is_array($value) && strlen(json_encode($value)) > 5000000) {
                        $value = null;
                        $modified = true;
                    }
                }
            }
        }

        if ($modified) {
            $invitation->canvas_config = $config;
            $invitation->save();
        }

        return view('builder', compact('invitation'));
    }

    public function uploadMedia(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,svg,webp,mp4,mov,webm,ogg,json,txt|max:51200', // Max 50MB
        ]);

        if ($request->file('file')) {
            $file = $request->file('file');
            $disk = config('filesystems.default');
            
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
                    
                    if ($mimeType == 'image/png' || $mimeType == 'image/webp') {
                        imagepalettetotruecolor($sourceImage);
                        imagealphablending($sourceImage, false);
                        imagesavealpha($sourceImage, true);
                    }

                    if ($mimeType == 'image/png') {
                        imagepng($sourceImage, $tempPath, 7);
                    } elseif ($mimeType == 'image/webp') {
                        imagewebp($sourceImage, $tempPath, 70);
                    } else {
                        imagejpeg($sourceImage, $tempPath, 70);
                    }
                    
                    imagedestroy($sourceImage);

                    $filename = \Illuminate\Support\Str::random(40) . '.' . $extension;
                    $path = 'invitations/media/' . $filename;
                    
                    \Illuminate\Support\Facades\Storage::disk($disk)->put($path, file_get_contents($tempPath), 'public');
                    @unlink($tempPath);
                } else {
                    $path = $file->storePublicly('invitations/media', $disk);
                }
            } else {
                $path = $file->storePublicly('invitations/media', $disk);
            }
            
            return response()->json([
                'success' => true,
                'url' => \Illuminate\Support\Facades\Storage::disk($disk)->url($path)
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }

    public function autoSave(Request $request, $id)
    {
        \Log::info('AutoSave triggered for ID: ' . $id);
        
        $invitation = Invitation::findOrFail($id);
        
        $request->validate([
            'canvas_config' => 'required|array'
        ]);

        $invitation->update([
            'canvas_config' => $request->canvas_config
        ]);

        return response()->json(['success' => true]);
    }

    public function saveAsTemplate(Request $request, $id)
    {
        $invitation = Invitation::findOrFail($id);
        
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'price' => 'numeric|min:0',
            'description' => 'nullable|string',
            'canvas_config' => 'required|array',
            'features' => 'nullable|array'
        ]);

        if ($request->category) {
            \App\Models\TemplateFolder::firstOrCreate(['name' => $request->category]);
        }

        $invitation->update([
            'title' => $request->title,
            'category' => $request->category,
            'price' => $request->price,
            'description' => $request->description,
            'canvas_config' => $request->canvas_config,
            'is_template' => true
        ]);

        $formSchema = [];
        if (!empty($request->features)) {
            $feats = $request->features;
            if (!empty($feats['photo'])) {
                $formSchema[] = [
                    'field_name' => 'Foto Galeri & Mempelai',
                    'type' => 'image',
                    'is_required' => true,
                    'max_files' => !empty($feats['max_photos']) ? (int)$feats['max_photos'] : 50
                ];
            }
            if (!empty($feats['audio'])) {
                $formSchema[] = [
                    'field_name' => 'File Audio / Musik Latar (MP3/WAV)',
                    'type' => 'audio',
                    'is_required' => false
                ];
            }
            if (!empty($feats['text'])) {
                $formSchema[] = [
                    'field_name' => 'Cerita Cinta / Quotes Khusus',
                    'type' => 'textarea',
                    'is_required' => false
                ];
            }
            if (!empty($feats['rekening'])) {
                $formSchema[] = [
                    'field_name' => 'Data Rekening Amplop Digital (Nama Bank, No Rek, Atas Nama)',
                    'type' => 'textarea',
                    'is_required' => false
                ];
            }
            if (!empty($feats['tanggal'])) {
                $formSchema[] = [
                    'field_name' => 'Waktu & Tanggal Acara',
                    'type' => 'textarea',
                    'is_required' => true
                ];
            }
            if (!empty($feats['lokasi'])) {
                $formSchema[] = [
                    'field_name' => 'Link Lokasi Acara (Google Maps)',
                    'type' => 'text',
                    'is_required' => true
                ];
            }
            if (!empty($feats['custom_request'])) {
                $formSchema[] = [
                    'field_name' => 'Request Warna Tema / Custom Kata / Catatan',
                    'type' => 'textarea',
                    'is_required' => false
                ];
            }
        }

        // Auto create/update Catalog Template so Orders can be created directly using this template
        $service = \App\Models\Service::firstOrCreate(
            ['slug' => 'event-digital'],
            ['title' => 'Event Digital', 'description' => 'Layanan Undangan Digital']
        );

        if ($service) {
            \App\Models\Template::updateOrCreate(
                ['invitation_id' => $invitation->id],
                [
                    'service_id' => $service->id,
                    'name' => $request->title,
                    'price' => $request->price ?: 0,
                    'category' => $request->category,
                    'form_schema' => $formSchema,
                    'is_active' => true,
                    'sort_order' => 0,
                    'preview_url' => url('/' . $invitation->slug)
                ]
            );
        }

        return response()->json(['success' => true]);
    }

    public function publish(Request $request, $id)
    {
        $invitation = Invitation::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:draft,published',
            'duration' => 'nullable|string'
        ]);

        $invitation->status = $request->status;

        if ($request->status === 'published') {
            $invitation->published_at = now();
            
            if ($request->duration === '2_weeks') {
                $invitation->expires_at = now()->addWeeks(2);
            } elseif ($request->duration === '1_month') {
                $invitation->expires_at = now()->addMonth();
            } elseif ($request->duration === '1_year') {
                $invitation->expires_at = now()->addYear();
            } else {
                $invitation->expires_at = null;
            }
        }

        $invitation->save();

        return response()->json([
            'success' => true, 
            'status' => $invitation->status,
            'published_at' => $invitation->published_at,
            'expires_at' => $invitation->expires_at,
            'url' => url('/' . $invitation->slug)
        ]);
    }

    public function getClientAssets($invitation_id)
    {
        $invitation = Invitation::findOrFail($invitation_id);
        
        if (!$invitation->order_id) {
            return response()->json([]);
        }

        $assets = \App\Models\ClientAsset::where('order_id', $invitation->order_id)->get();
        
        $formattedAssets = $assets->map(function ($asset) {
            return [
                'id' => $asset->id,
                'field_name' => $asset->field_name,
                'type' => $asset->type,
                'content' => $asset->content,
                'url' => in_array($asset->type, ['image', 'audio']) && $asset->file_path ? url('storage/' . $asset->file_path) : null,
            ];
        });

        return response()->json($formattedAssets);
    }
}
