<?php
namespace App\Jobs;

use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class SendWhatsAppMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $guest;
    public $link;
    public $invitation;

    public function __construct(Guest $guest, $link, Invitation $invitation)
    {
        $this->guest = $guest;
        $this->link = $link;
        $this->invitation = $invitation;
    }

    public function handle()
    {
        $client = new Client();
        $message = "Halo {$this->guest->name},\n\nKami mengundang Anda di acara pernikahan kami.\nBuka undangan digital Anda melalui tautan eksklusif berikut:\n{$this->link}";

        try {
            // Mockup Endpoint Gateway WA Pihak Ketiga (seperti Wablas, Fonnte, dll)
            /*
            $response = $client->post('https://api.wa-gateway.example/send', [
                'headers' => ['Authorization' => 'Bearer API_TOKEN_ANDA'],
                'json' => [
                    'phone' => $this->guest->whatsapp_number,
                    'message' => $message
                ]
            ]);
            */
            
            // Simulasi pengiriman sukses (mengubah status agar tidak di-blast dua kali)
            Log::info("WhatsApp Blast berhasil terkirim ke: {$this->guest->whatsapp_number}");
            $this->guest->update(['wa_blast_status' => 'sent']);
            
        } catch (\Exception $e) {
            Log::error("Gagal mengirim WhatsApp ke {$this->guest->whatsapp_number}: " . $e->getMessage());
            $this->guest->update(['wa_blast_status' => 'failed']);
        }
    }
}
