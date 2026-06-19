<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function create($template_id)
    {
        $template = \App\Models\Template::with(['package', 'service'])->findOrFail($template_id);
        return view('order-form', compact('template'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'template_id' => 'required|exists:templates,id',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:50',
            'event_date' => 'nullable|date',
            'quantity' => 'nullable|integer|min:1',
            // other fields are optional and go to json
        ]);

        $template = \App\Models\Template::with(['serviceCategory', 'service', 'package'])->findOrFail($request->template_id);
        
        $details = $request->except(['_token', 'template_id', 'customer_name', 'customer_phone', 'event_date', 'quantity', 'guest_list', 'custom_requests', 'calculated_total']);

        $basePrice = ($template->discount_price && $template->discount_price < $template->price) 
            ? $template->discount_price 
            : ($template->price ?? ($template->package->price ?? 0));
            
        $totalPrice = $request->calculated_total ?? ($basePrice * ($request->quantity ?? 1));

        $order = \App\Models\Order::create([
            'template_id' => $template->id,
            'package_id' => $template->package_id,
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'event_date' => $request->event_date,
            'quantity' => $request->quantity ?? 1,
            'guest_list' => $request->guest_list,
            'custom_requests' => $request->custom_requests,
            'details' => $details,
            'total_price' => $totalPrice,
            'status' => 'pending',
        ]);

        \App\Models\Cashflow::create([
            'service_id' => $template->service_id,
            'type' => 'income',
            'amount' => $totalPrice,
            'description' => 'Pesanan Baru #' . str_pad($order->id, 5, '0', STR_PAD_LEFT) . ' - ' . $template->name,
            'reference_type' => 'App\Models\Order',
            'reference_id' => $order->id,
            'transaction_date' => now()->toDateString(),
        ]);

        // Generate WA Link
        $phone = '6285196811112'; // Admin Phone
        $text = "Halo Nalaruang.id, saya telah melakukan pemesanan via website.\n\n";
        $text .= "*ID Pesanan:* #" . str_pad($order->id, 5, '0', STR_PAD_LEFT) . "\n";
        $text .= "*Nama:* " . $order->customer_name . "\n";
        $text .= "*No HP:* " . $order->customer_phone . "\n";
        $text .= "*Layanan:* " . ($template->service->title ?? '-') . "\n";
        
        if ($template->serviceCategory) {
            $text .= "*Kategori:* " . $template->serviceCategory->name . "\n";
        }
        
        $text .= "*Pilihan / Desain:* " . $template->name . "\n";
        $text .= "*Kuantitas:* " . $order->quantity . "\n";
        
        if ($order->event_date) {
            $text .= "*Tanggal Acara:* " . $order->event_date->format('d/m/Y') . "\n";
        }

        $text .= "\n*ESTIMASI TOTAL BIAYA: Rp " . number_format($order->total_price, 0, ',', '.') . "*\n";

        if (!empty($details)) {
            $text .= "\n*Detail Spesifik:*\n";
            foreach ($details as $key => $val) {
                if (is_string($val)) {
                    $text .= "- " . ucwords(str_replace('_', ' ', $key)) . ": " . $val . "\n";
                }
            }
        }
        
        if ($order->custom_requests) {
            $text .= "\n*Request Tambahan:*\n" . $order->custom_requests . "\n";
        }
        
        // Custom message for Print/Lanyard where files are needed via WA
        $formType = $template->serviceCategory->form_type ?? 'undangan';
        if (in_array($formType, ['print', 'lanyard'])) {
            $text .= "\n[SAYA AKAN MENGIRIMKAN FILE DESAIN/DOKUMEN SETELAH INI]\n";
        }
        
        $text .= "\nMohon informasi untuk langkah selanjutnya. Terima kasih!";

        $waLink = "https://wa.me/" . $phone . "?text=" . urlencode($text);

        return redirect()->away($waLink);
    }
}
