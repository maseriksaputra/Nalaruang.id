<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClientFormController extends Controller
{
    public function show($token)
    {
        $order = \App\Models\Order::with('template')
            ->where('form_token', $token)
            ->firstOrFail();

        // Check expiration
        if ($order->form_expires_at && $order->form_expires_at->isPast()) {
            abort(403, 'Link form ini sudah kedaluwarsa.');
        }

        // Check if already submitted
        if ($order->form_status === 'submitted') {
            return view('client-form.success', compact('order'));
        }

        $template = $order->template;
        $schema = !empty($order->custom_form_schema) ? $order->custom_form_schema : ($template ? ($template->form_schema ?? []) : [
            ['field_name' => 'Nama Mempelai Pria (Lengkap)', 'type' => 'text', 'is_required' => true],
            ['field_name' => 'Nama Panggilan Mempelai Pria', 'type' => 'text', 'is_required' => true],
            ['field_name' => 'Nama Orang Tua Mempelai Pria & Anak Keberapa', 'type' => 'textarea', 'is_required' => false],
            ['field_name' => 'Nama Mempelai Wanita (Lengkap)', 'type' => 'text', 'is_required' => true],
            ['field_name' => 'Nama Panggilan Mempelai Wanita', 'type' => 'text', 'is_required' => true],
            ['field_name' => 'Nama Orang Tua Mempelai Wanita & Anak Keberapa', 'type' => 'textarea', 'is_required' => false],
            ['field_name' => 'Informasi Akad Nikah (Tanggal, Jam, Tempat)', 'type' => 'textarea', 'is_required' => false],
            ['field_name' => 'Informasi Resepsi (Tanggal, Jam, Tempat)', 'type' => 'textarea', 'is_required' => false],
            ['field_name' => 'Informasi Rekening / Amplop Digital', 'type' => 'textarea', 'is_required' => false],
            ['field_name' => 'Kisah Cinta / Narasi / Ucapan', 'type' => 'textarea', 'is_required' => false],
            ['field_name' => 'Galeri Foto & Video', 'type' => 'image', 'is_required' => false, 'max_files' => 50],
            ['field_name' => 'Musik / Backsound (Opsional)', 'type' => 'audio', 'is_required' => false],
            ['field_name' => 'Request Desain Spesifik / Catatan', 'type' => 'textarea', 'is_required' => false],
        ]);

        return view('client-form.show', compact('order', 'template', 'schema'));
    }

    public function submit(Request $request, $token)
    {
        $order = \App\Models\Order::with('template')
            ->where('form_token', $token)
            ->firstOrFail();

        if ($order->form_expires_at && $order->form_expires_at->isPast()) {
            abort(403, 'Link form ini sudah kedaluwarsa.');
        }
        if ($order->form_status === 'submitted') {
            abort(403, 'Form ini sudah dikirim sebelumnya.');
        }

        $template = $order->template;
        $schema = !empty($order->custom_form_schema) ? $order->custom_form_schema : ($template ? ($template->form_schema ?? []) : [
            ['field_name' => 'Nama Mempelai Pria (Lengkap)', 'type' => 'text', 'is_required' => true],
            ['field_name' => 'Nama Panggilan Mempelai Pria', 'type' => 'text', 'is_required' => true],
            ['field_name' => 'Nama Orang Tua Mempelai Pria & Anak Keberapa', 'type' => 'textarea', 'is_required' => false],
            ['field_name' => 'Nama Mempelai Wanita (Lengkap)', 'type' => 'text', 'is_required' => true],
            ['field_name' => 'Nama Panggilan Mempelai Wanita', 'type' => 'text', 'is_required' => true],
            ['field_name' => 'Nama Orang Tua Mempelai Wanita & Anak Keberapa', 'type' => 'textarea', 'is_required' => false],
            ['field_name' => 'Informasi Akad Nikah (Tanggal, Jam, Tempat)', 'type' => 'textarea', 'is_required' => false],
            ['field_name' => 'Informasi Resepsi (Tanggal, Jam, Tempat)', 'type' => 'textarea', 'is_required' => false],
            ['field_name' => 'Informasi Rekening / Amplop Digital', 'type' => 'textarea', 'is_required' => false],
            ['field_name' => 'Kisah Cinta / Narasi / Ucapan', 'type' => 'textarea', 'is_required' => false],
            ['field_name' => 'Galeri Foto & Video', 'type' => 'image', 'is_required' => false, 'max_files' => 50],
            ['field_name' => 'Musik / Backsound (Opsional)', 'type' => 'audio', 'is_required' => false],
            ['field_name' => 'Request Desain Spesifik / Catatan', 'type' => 'textarea', 'is_required' => false],
        ]);

        // Validation Rules based on schema
        $rules = [];
        foreach ($schema as $field) {
            $fieldName = \Illuminate\Support\Str::slug($field['field_name'], '_');
            if (!empty($field['is_required'])) {
                $rules[$fieldName] = 'required';
                if ($field['type'] === 'image') {
                    $rules[$fieldName] = "required|array";
                    if (isset($field['max_files']) && $field['max_files'] > 0) {
                        $rules[$fieldName] .= "|max:{$field['max_files']}";
                    }
                    $rules[$fieldName.'.*'] = 'file|mimes:jpeg,png,jpg,gif,svg,webp,mp4,mov,webm,ogg|max:51200'; // Max 50MB per media
                } elseif ($field['type'] === 'audio') {
                    $rules[$fieldName] = "required|file|mimes:mp3,wav|max:20480"; // Max 20MB
                }
            } else {
                $rules[$fieldName] = 'nullable';
                if ($field['type'] === 'image') {
                    $rules[$fieldName] = "nullable|array";
                    if (isset($field['max_files']) && $field['max_files'] > 0) {
                        $rules[$fieldName] .= "|max:{$field['max_files']}";
                    }
                    $rules[$fieldName.'.*'] = 'file|mimes:jpeg,png,jpg,gif,svg,webp,mp4,mov,webm,ogg|max:51200'; // Max 50MB per media
                } elseif ($field['type'] === 'audio') {
                    $rules[$fieldName] = "nullable|file|mimes:mp3,wav|max:20480"; // Max 20MB
                }
            }
        }

        $validated = $request->validate($rules);

        // Process uploads and save assets
        foreach ($schema as $field) {
            $fieldName = \Illuminate\Support\Str::slug($field['field_name'], '_');
            if ($field['type'] === 'image' && $request->hasFile($fieldName)) {
                $files = $request->file($fieldName);
                if (!is_array($files)) {
                    $files = [$files];
                }
                foreach ($files as $file) {
                    $path = $file->storePublicly('client-assets/'.$order->id, config('filesystems.default'));
                    // Detect if it's a video based on mime type or extension
                    $mime = $file->getMimeType();
                    $isVid = str_starts_with($mime, 'video/');
                    \App\Models\ClientAsset::create([
                        'order_id' => $order->id,
                        'field_name' => $field['field_name'],
                        'type' => $isVid ? 'video' : 'image',
                        'file_path' => $path,
                    ]);
                }
            } elseif ($field['type'] === 'audio' && $request->hasFile($fieldName)) {
                $file = $request->file($fieldName);
                $path = $file->storePublicly('client-assets/'.$order->id.'/audio', config('filesystems.default'));
                \App\Models\ClientAsset::create([
                    'order_id' => $order->id,
                    'field_name' => $field['field_name'],
                    'type' => 'audio',
                    'file_path' => $path,
                ]);
            } elseif (in_array($field['type'], ['text', 'textarea']) && isset($validated[$fieldName])) {
                \App\Models\ClientAsset::create([
                    'order_id' => $order->id,
                    'field_name' => $field['field_name'],
                    'type' => 'text',
                    'content' => strip_tags($validated[$fieldName]), // Security: Prevent XSS
                ]);
            }
        }

        // Update Order Status
        $order->update(['form_status' => 'submitted']);

        return redirect()->route('client.form.show', $token)->with('success', 'Berhasil! Data Anda telah kami terima. Kami akan segera memprosesnya.');
    }
}
