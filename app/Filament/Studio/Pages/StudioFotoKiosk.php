<?php

namespace App\Filament\Studio\Pages;

use Filament\Pages\Page;
use App\Models\PhotoTemplate;

class StudioFotoKiosk extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-camera';
    protected static ?string $navigationGroup = 'Nalaruang Studio';
    protected static ?string $navigationLabel = 'Kiosk Studio Foto';
    protected static ?string $title = 'Photobox Studio';
    protected static string $view = 'filament.pages.studio-foto-kiosk';

    // We can hide this from the standard layout by returning a layout that doesn't have the sidebar
    // However, to keep it simple, we can just use the default Filament layout and make the camera area full width.
    // Or we can use a custom layout. For now, let's stick to the default layout.
    
    // Properties to hold state
    public $templates = [];
    public $selectedTemplateId = null;
    public $selectedTemplate = null;

    public function mount()
    {
        $this->templates = PhotoTemplate::where('is_active', true)->get();
    }

    public function selectTemplate($id)
    {
        $this->selectedTemplateId = $id;
        $this->selectedTemplate = PhotoTemplate::find($id);
    }
    
    public function cancelSession()
    {
        $this->selectedTemplateId = null;
        $this->selectedTemplate = null;
    }
    
    public function savePhotoSession($base64Image)
    {
        // Decode base64 and save to disk
        $image_parts = explode(";base64,", $base64Image);
        if (count($image_parts) != 2) return;
        
        $image_type_aux = explode("image/", $image_parts[0]);
        $image_type = $image_type_aux[1];
        $image_base64 = base64_decode($image_parts[1]);
        
        $fileName = 'photobooth_' . time() . '.png';
        $path = storage_path('app/public/photo_sessions/' . $fileName);
        
        if (!file_exists(storage_path('app/public/photo_sessions'))) {
            mkdir(storage_path('app/public/photo_sessions'), 0777, true);
        }
        
        file_put_contents($path, $image_base64);
        
        // Save to Database
        \App\Models\PhotoSession::create([
            'photo_template_id' => $this->selectedTemplateId,
            'customer_name' => 'Guest ' . rand(1000, 9999),
            'final_image' => 'photo_sessions/' . $fileName,
            'total_price' => $this->selectedTemplate->price ?? 0,
        ]);
        
        // Fire event to notify success
        $this->dispatch('photo-saved', ['url' => asset('storage/photo_sessions/' . $fileName)]);
    }
}
