<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\GuestLink;
use App\Models\Rsvp;
use App\Models\InvitationVisitor;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class DashboardPortalController extends Controller
{
    private function generateUniqueSlug($title)
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 1;
        while (Invitation::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
        return $slug;
    }
    public function index()
    {
        return view('invitation-portal');
    }

    public function getInvitations()
    {
        // Hindari mengambil kolom 'canvas_config' yang sangat berat
        $invitations = Invitation::select('id', 'title', 'slug', 'status', 'thumbnail_path', 'updated_at', 'created_at')
            ->where('is_template', false)
            ->orderBy('updated_at', 'desc')
            ->get();
        return response()->json($invitations);
    }

    public function getStatistics()
    {
        $totalVisitors = InvitationVisitor::count();
        $totalGuests = GuestLink::count();
        $totalRsvp = Rsvp::count();
        $engagementRate = $totalGuests > 0 ? round(($totalVisitors / $totalGuests) * 100, 1) : 0;

        $hadir = Rsvp::where('status', 'Hadir')->count();
        $tidakHadir = Rsvp::where('status', '!=', 'Hadir')->count();

        // Trend 30 Hari
        $startDate = Carbon::now()->subDays(29)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $visits = InvitationVisitor::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as aggregate')
            )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $chartData = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $chartData[] = [
                'name' => Carbon::parse($date)->format('d M'),
                'visits' => $visits->has($date) ? $visits[$date]->aggregate : 0
            ];
        }

        // Top 10 Invitations
        $topInvitations = Invitation::select('id', 'title', 'slug', 'thumbnail_path')
            ->withCount(['visitors', 'rsvps', 'guestLinks'])
            ->orderBy('visitors_count', 'desc')
            ->orderBy('rsvps_count', 'desc')
            ->take(10)
            ->get()
            ->map(function ($inv) {
                // Pastikan thumbnail valid
                $thumbnail = $inv->thumbnail_path;
                if ($thumbnail && !Str::startsWith($thumbnail, 'http')) {
                    $thumbnail = asset($thumbnail);
                }

                return [
                    'id' => $inv->id,
                    'title' => $inv->title,
                    'slug' => $inv->slug,
                    'thumbnail' => $thumbnail,
                    'visitors_count' => $inv->visitors_count,
                    'rsvps_count' => $inv->rsvps_count,
                    'guests_count' => $inv->guest_links_count,
                ];
            });

        return response()->json([
            'overview' => [
                'totalGuests' => $totalGuests,
                'totalVisitors' => $totalVisitors,
                'engagementRate' => $engagementRate,
                'totalRsvp' => $totalRsvp
            ],
            'rsvpPie' => [
                ['name' => 'Hadir', 'value' => $hadir],
                ['name' => 'Tidak Hadir', 'value' => $tidakHadir],
            ],
            'chartData' => $chartData,
            'topInvitations' => $topInvitations
        ]);
    }

    public function getTemplates()
    {
        $templates = Invitation::select('id', 'title', 'slug', 'thumbnail_path', 'price', 'category', 'total_uses', 'updated_at')
            ->where('is_template', true)
            ->orderBy('updated_at', 'desc')
            ->get();
        return response()->json($templates);
    }

    public function duplicateTemplate(Request $request, $id)
    {
        try {
            $template = Invitation::findOrFail($id);
            
            // Increment total_uses
            $template->increment('total_uses');

            $count = Invitation::withTrashed()->where('is_template', false)->count();
            $newTitle = 'Desain ' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

            $newInvitation = Invitation::create([
                'user_id' => auth()->id() ?? 2,
                'title' => $newTitle,
                'slug' => $this->generateUniqueSlug($newTitle),
                'status' => 'draft',
                'canvas_config' => $template->canvas_config,
                'is_template' => false
            ]);

            return response()->json([
                'success' => true,
                'id' => $newInvitation->id,
                'redirect_url' => url('/admin/builder/' . $newInvitation->id)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Gagal menduplikasi template: ' . $e->getMessage()
            ], 500);
        }
    }

    public function toggleTemplate(Request $request, $id)
    {
        try {
            $invitation = Invitation::findOrFail($id);
            $invitation->is_template = !$invitation->is_template;
            $invitation->save();

            return response()->json([
                'success' => true,
                'is_template' => $invitation->is_template
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Gagal mengubah status template: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateThumbnail(Request $request, $id)
    {
        $request->validate([
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        try {
            $invitation = Invitation::findOrFail($id);
            if ($request->hasFile('thumbnail')) {
                $disk = config('filesystems.default');
                $path = $request->file('thumbnail')->store('templates/thumbnails', $disk);
                $invitation->thumbnail_path = \Illuminate\Support\Facades\Storage::disk($disk)->url($path);
                $invitation->save();
            }

            return response()->json([
                'success' => true,
                'thumbnail_url' => $invitation->thumbnail_path
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Gagal mengupload thumbnail: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getTemplateFolders()
    {
        $folders = \App\Models\TemplateFolder::orderBy('name')->get();
        return response()->json($folders);
    }

    public function storeTemplateFolder(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:template_folders,name']);
        $folder = \App\Models\TemplateFolder::create(['name' => $request->name]);
        return response()->json(['success' => true, 'folder' => $folder]);
    }

    public function getRsvps()
    {
        $rsvps = \App\Models\Rsvp::with('invitation')->orderBy('created_at', 'desc')->get();
        return response()->json($rsvps);
    }

    public function getGuestLinks($invitationId)
    {
        $links = \App\Models\GuestLink::where('invitation_id', $invitationId)->orderBy('created_at', 'desc')->get();
        return response()->json($links);
    }

    public function storeGuestLink(Request $request, $invitationId)
    {
        $request->validate(['guest_name' => 'required|string']);
        $link = \App\Models\GuestLink::create([
            'invitation_id' => $invitationId,
            'guest_name' => $request->guest_name,
            'custom_message' => $request->custom_message
        ]);
        return response()->json($link);
    }

    public function storeBatchGuestLinks(Request $request, $invitationId)
    {
        $request->validate(['guest_names' => 'required|array']);
        
        $links = [];
        foreach ($request->guest_names as $name) {
            $name = trim($name);
            if (!empty($name)) {
                $links[] = \App\Models\GuestLink::create([
                    'invitation_id' => $invitationId,
                    'guest_name' => $name,
                ]);
            }
        }
        return response()->json(['success' => true, 'links' => $links]);
    }

    public function updateGreeting(Request $request, $invitationId)
    {
        $request->validate(['whatsapp_greeting' => 'nullable|string']);
        $invitation = Invitation::findOrFail($invitationId);
        $invitation->whatsapp_greeting = $request->whatsapp_greeting;
        $invitation->save();

        return response()->json(['success' => true]);
    }

    public function renameInvitation(Request $request, $id)
    {
        $request->validate(['title' => 'required|string']);
        $invitation = Invitation::findOrFail($id);
        $invitation->title = $request->title;
        $invitation->save();

        return response()->json(['success' => true, 'title' => $invitation->title]);
    }

    public function updateSlug(Request $request, $id)
    {
        $request->validate([
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('invitations')->ignore($id),
                'regex:/^[a-z0-9\-]+$/' // Only allow lowercase letters, numbers, and hyphens
            ]
        ]);

        $invitation = Invitation::findOrFail($id);
        $invitation->slug = $request->slug;
        $invitation->save();

        return response()->json(['success' => true, 'slug' => $invitation->slug]);
    }

    public function deleteInvitation($id)
    {
        $invitation = Invitation::findOrFail($id);
        $invitation->delete();

        return response()->json(['success' => true]);
    }

    public function store(Request $request)
    {
        try {
            $count = Invitation::withTrashed()->where('is_template', false)->count();
            $newTitle = 'Desain ' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

            $invitation = Invitation::create([
                'user_id' => auth()->id() ?? 2,
                'title' => $newTitle,
                'slug' => $this->generateUniqueSlug($newTitle),
                'status' => 'draft',
                'canvas_config' => [
                    'global_settings' => [
                        'theme_colors' => ['#ffffff', '#000000']
                    ],
                    'sections' => [
                        [
                            'id' => 'sec_' . uniqid(),
                            'layout' => ['height' => '100vh', 'background_value' => '#ffffff'],
                            'layers' => []
                        ]
                    ]
                ]
            ]);

            return response()->json([
                'success' => true,
                'id' => $invitation->id,
                'redirect_url' => url('/admin/builder/' . $invitation->id)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getOrders()
    {
        $orders = \App\Models\Order::with('template:id,name,image,preview_url')->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:pending,diproses,selesai,dibatalkan,revisi']);
        $order = \App\Models\Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();
        return response()->json(['success' => true, 'status' => $order->status]);
    }

    public function generateOrderForm($id)
    {
        $order = \App\Models\Order::findOrFail($id);
        if (empty($order->form_token)) {
            $order->form_token = Str::random(32);
            $order->form_expires_at = now()->addDays(30);
            $order->save();
        }
        return response()->json(['success' => true, 'form_token' => $order->form_token]);
    }

    public function renameOrder(Request $request, $id)
    {
        $request->validate(['customer_name' => 'required|string']);
        $order = \App\Models\Order::findOrFail($id);
        $order->customer_name = $request->customer_name;
        $order->save();
        return response()->json(['success' => true]);
    }

    public function deleteOrder($id)
    {
        $order = \App\Models\Order::findOrFail($id);
        $order->delete();
        return response()->json(['success' => true]);
    }

    public function generateOrderProject($id)
    {
        try {
            $order = \App\Models\Order::with('template')->findOrFail($id);
            
            // Check if project already exists for this order
            $existingProject = Invitation::where('order_id', $order->id)->first();
            if ($existingProject) {
                return response()->json([
                    'success' => true, 
                    'id' => $existingProject->id, 
                    'redirect_url' => url('/admin/builder/' . $existingProject->id)
                ]);
            }

            if (!$order->template) {
                return response()->json(['success' => false, 'error' => 'Template tidak ditemukan untuk pesanan ini.'], 404);
            }

            $templateProject = Invitation::where('is_template', true)
                                ->where('id', $order->template->invitation_id ?? 0)
                                ->first();

            // If template linked directly to invitation
            if (!$templateProject) {
                // Try finding by slug or name logic if invitation_id is not set
                $templateProject = Invitation::where('is_template', true)->first();
            }

            if (!$templateProject) {
                return response()->json(['success' => false, 'error' => 'Project Template asli tidak ditemukan di sistem.'], 404);
            }

            $templateProject->increment('total_uses');

            $count = Invitation::withTrashed()->where('is_template', false)->count();
            $newTitle = 'Undangan ' . $order->customer_name . ' - ' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

            $newInvitation = Invitation::create([
                'user_id' => auth()->id() ?? 2,
                'order_id' => $order->id,
                'title' => $newTitle,
                'slug' => $this->generateUniqueSlug($newTitle),
                'status' => 'draft',
                'canvas_config' => $templateProject->canvas_config,
                'is_template' => false
            ]);

            return response()->json([
                'success' => true,
                'id' => $newInvitation->id,
                'redirect_url' => url('/admin/builder/' . $newInvitation->id)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Gagal membuat project: ' . $e->getMessage()
            ], 500);
        }
    }
}
