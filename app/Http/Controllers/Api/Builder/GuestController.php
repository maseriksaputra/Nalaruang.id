<?php
namespace App\Http\Controllers\Api\Builder;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use App\Models\Invitation;
use App\Jobs\SendWhatsAppMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GuestController extends Controller
{
    public function importCsv(Request $request, Invitation $invitation)
    {
        $request->validate(['csv_file' => 'required|file|mimes:csv,txt']);
        
        $path = $request->file('csv_file')->getRealPath();
        $data = array_map('str_getcsv', file($path));
        $header = array_shift($data);
        
        $imported = 0;
        foreach ($data as $row) {
            if (count($header) == count($row)) {
                $row = array_combine($header, $row);
                $name = $row['name'] ?? null;
                $phone = $row['phone'] ?? null;
                
                if ($name && $phone) {
                    Guest::updateOrCreate(
                        ['invitation_id' => $invitation->id, 'whatsapp_number' => $phone],
                        [
                            'name' => $name,
                            'url_parameter' => Str::slug($name),
                        ]
                    );
                    $imported++;
                }
            }
        }
        return response()->json(['message' => "$imported guests imported successfully."]);
    }

    public function blastWhatsapp(Invitation $invitation)
    {
        $guests = $invitation->guests()->where('wa_blast_status', '!=', 'sent')->get();
        
        foreach ($guests as $guest) {
            $link = url("/{$invitation->slug}?to={$guest->url_parameter}");
            $guest->update(['wa_blast_status' => 'queued']);
            SendWhatsAppMessage::dispatch($guest, $link, $invitation);
        }
        
        return response()->json(['message' => count($guests) . ' messages queued for blasting.']);
    }
}
