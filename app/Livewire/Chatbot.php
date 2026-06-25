<?php

namespace App\Livewire;

use Livewire\Component;
use Illuminate\Support\Facades\Http;
use App\Models\Template;
use Illuminate\Support\Facades\Log;

class Chatbot extends Component
{
    public string $newMessage = '';
    public array $messages = [];
    public bool $isOpen = false;

    public function mount()
    {
        $this->messages[] = [
            'role' => 'model',
            'content' => 'Halo! Saya asisten cerdas Nalaruang.id 👋 Ada yang ingin ditanyakan seputar katalog produk atau layanan kami?'
        ];
    }

    public function sendMessage()
    {
        if (trim($this->newMessage) === '') return;

        // Tambahkan pesan user ke UI langsung
        $this->messages[] = [
            'role' => 'user',
            'content' => $this->newMessage
        ];

        $userMessage = $this->newMessage;
        $this->newMessage = '';

        // Siapkan konteks produk
        $products = Template::where('is_active', true)->get();
        $contextString = "Kamu adalah Customer Service cerdas, ramah, dan solutif dari Nalaruang.id. Jawab dengan bahasa Indonesia santai tapi profesional (gunakan sapaan 'Kak' atau 'Mas/Mbak').\n";
        $contextString .= "Berikut adalah data produk dan layanan Nalaruang.id saat ini dari database:\n\n";
        
        foreach ($products as $p) {
            $contextString .= "- Nama Produk: {$p->name}\n  Harga: Rp " . number_format($p->price, 0, ',', '.') . "\n  Stok: " . ($p->stok > 0 ? "Tersedia ({$p->stok})" : "Habis") . "\n  Kategori: {$p->category}\n";
            if (!empty($p->description)) {
                $contextString .= "  Deskripsi: " . strip_tags($p->description) . "\n";
            }
            $contextString .= "\n";
        }
        $contextString .= "Aturan penting:\n1. Jika ditanya soal harga/stok, beritahu sesuai data di atas.\n2. Jika produk habis, tawarkan produk lain di kategori yang sama.\n3. Jangan mengarang harga atau produk yang tidak ada di daftar.\n4. Format balasan boleh pakai Markdown ringan (bold, bullet points).\n5. Nalaruang melayani Cetak Fisik, Event Digital, Souvenir, dan Web/Mobile App.\n6. Berikan balasan singkat, jelas, dan ramah.";

        // Bangun riwayat untuk dikirim ke Gemini
        $contents = [];
        foreach ($this->messages as $msg) {
            $contents[] = [
                'role' => $msg['role'],
                'parts' => [['text' => $msg['content']]]
            ];
        }

        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            $this->messages[] = [
                'role' => 'model',
                'content' => 'Mohon maaf, sistem AI belum dikonfigurasi (API Key belum diisi di server). Silakan hubungi admin.'
            ];
            return;
        }

        try {
            // Gunakan v1beta untuk fitur system_instruction
            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
                'system_instruction' => [
                    'parts' => [['text' => $contextString]]
                ],
                'contents' => $contents
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Maaf, saya tidak mengerti maksud Kakak.';
                
                $this->messages[] = [
                    'role' => 'model',
                    'content' => $reply
                ];
            } else {
                Log::error('Gemini API Error: ' . $response->body());
                $this->messages[] = [
                    'role' => 'model',
                    'content' => 'Maaf Kak, server AI sedang sibuk atau mengalami gangguan sesaat. Mohon coba beberapa saat lagi.'
                ];
            }
        } catch (\Exception $e) {
            Log::error('Gemini Exception: ' . $e->getMessage());
            $this->messages[] = [
                'role' => 'model',
                'content' => 'Maaf Kak, terjadi kesalahan jaringan ke server AI. Mohon coba kembali.'
            ];
        }
    }

    public function render()
    {
        return view('livewire.chatbot');
    }
}
