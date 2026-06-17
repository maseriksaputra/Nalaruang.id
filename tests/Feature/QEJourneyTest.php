<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Service;
use App\Models\Package;
use App\Models\Category;
use App\Models\Template;
use App\Models\Order;
use App\Models\Invitation;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class QEJourneyTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_full_qe_journey_from_admin_to_guest()
    {
        Storage::fake('public'); // Fake storage for file uploads
        
        // 1. SETUP DATA ADMIN
        $admin = User::factory()->create();
        $this->actingAs($admin);

        $service = Service::create(['title' => 'Wedding Invitation', 'slug' => 'wedding-invitation']);
        $category = Category::create(['name' => 'Rustic', 'slug' => 'rustic', 'service_id' => $service->id]);
        $package = Package::create(['name' => 'Premium', 'price' => 150000, 'service_id' => $service->id, 'features' => json_encode(['photo' => true, 'video' => true])]);
        
        $template = Template::create([
            'name' => 'Rustic Elegant',
            'service_id' => $service->id,
            'category_id' => $category->id,
            'package_id' => $package->id,
            'form_schema' => [
                ['field_name' => 'Nama Mempelai Pria', 'type' => 'text', 'is_required' => true],
                ['field_name' => 'Foto Galeri', 'type' => 'image', 'is_required' => true, 'max_files' => 5]
            ],
            'price' => 150000,
            'is_active' => true
        ]);

        $this->assertDatabaseHas('templates', ['name' => 'Rustic Elegant']);

        // 2. ADMIN CREATES ORDER
        $order = Order::create([
            'template_id' => $template->id,
            'package_id' => $package->id,
            'customer_name' => 'Budi Client',
            'customer_phone' => '081234567890',
            'event_date' => now()->addDays(30),
            'quantity' => 1,
            'status' => 'pending',
            'total_price' => 150000,
        ]);

        // Admin generates form token
        $response = $this->post("/admin/invitation-portal/orders/{$order->id}/generate-form");
        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
        
        $order->refresh();
        $this->assertNotNull($order->form_token);
        $this->assertEquals('pending', $order->form_status);

        // 3. CLIENT FILLS FORM
        // Logout admin to simulate public client access
        auth()->logout();

        $formResponse = $this->get("/client/form/{$order->form_token}");
        $formResponse->assertStatus(200);

        // Client submits form with a text and an image & a fake video!
        $submitResponse = $this->post("/client/form/{$order->form_token}", [
            'nama_mempelai_pria' => 'Budi Santoso',
            'foto_galeri' => [
                UploadedFile::fake()->image('budi_photo.jpg')->size(500),
                UploadedFile::fake()->create('budi_video.mp4', 25000, 'video/mp4') // 25MB video
            ]
        ]);
        
        $submitResponse->assertStatus(302);
        
        $order->refresh();
        $this->assertEquals('submitted', $order->form_status);

        // Check if assets are in DB
        $this->assertDatabaseCount('client_assets', 3);
        $this->assertDatabaseHas('client_assets', [
            'order_id' => $order->id,
            'field_name' => 'Nama Mempelai Pria',
            'type' => 'text',
            'content' => 'Budi Santoso'
        ]);
        // The file uploads will have 'image' or 'video' type based on MIME
        $this->assertDatabaseHas('client_assets', [
            'order_id' => $order->id,
            'field_name' => 'Foto Galeri',
            'type' => 'video'
        ]);

        // 4. ADMIN AUTOGENERATE PROJECT
        $this->actingAs($admin);
        
        // Buat Template Invitation Dummy agar sistem bisa cloning design
        $baseTemplate = Invitation::create([
            'user_id' => $admin->id,
            'title' => 'Master Template Rustic',
            'slug' => 'master-template',
            'is_template' => true,
            'canvas_config' => ['test' => 'data']
        ]);
        
        $generateResponse = $this->post("/admin/invitation-portal/orders/{$order->id}/generate-project", [
            'project_name' => 'Budi Wedding',
            'project_slug' => 'budi-wedding'
        ]);
        
        $generateResponse->assertStatus(200)
                         ->assertJson(['success' => true]);
        
        $newInvId = $generateResponse->json('id');
        
        $this->assertDatabaseHas('invitations', [
            'id' => $newInvId,
            'order_id' => $order->id
        ]);

        $invitation = Invitation::find($newInvId);
        
        // Publish it so guests can see it
        $invitation->status = 'published';
        $invitation->save();

        // 5. GUEST VIEWS INVITATION AND SUBMITS RSVP
        auth()->logout();
        
        $viewResponse = $this->get('/' . $invitation->slug);
        $viewResponse->assertStatus(200);

        // Guest submits RSVP
        $rsvpResponse = $this->postJson('/' . $invitation->slug . '/rsvp', [
            'name' => 'Andi Teman',
            'status' => 'Hadir',
            'message' => 'Selamat Budi! Semoga samawa.'
        ]);
        
        $rsvpResponse->assertStatus(200)
                     ->assertJson(['success' => true]);

        // Verify RSVP DB
        $this->assertDatabaseHas('rsvps', [
            'invitation_id' => $invitation->id,
            'name' => 'Andi Teman',
            'status' => 'Hadir'
        ]);
        
        // Verify Visitor is recorded
        $this->assertDatabaseCount('invitation_visitors', 1);
        $this->assertDatabaseHas('invitation_visitors', [
            'invitation_id' => $invitation->id
        ]);
    }
}
