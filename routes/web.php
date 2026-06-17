<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientFormController;

Route::get('/', [\App\Http\Controllers\PublicController::class, 'index']);
Route::get('/layanan/{slug}', [ServiceController::class, 'show'])->name('service.show');

// Client Form Routes
Route::get('/client/form/{token}', [ClientFormController::class, 'show'])->name('client.form.show');
Route::post('/client/form/{token}', [ClientFormController::class, 'submit'])->name('client.form.submit');

Route::get('/test-post', function () {
    return '<form method="POST" action="/test-post-submit"><input type="hidden" name="_token" value="'.csrf_token().'"><button type="submit">Test POST</button></form>';
});
Route::post('/test-post-submit', function () {
    return 'POST BERHASIL! Berarti masalahnya ada di Livewire, bukan Nginx.';
});

Route::get('/order/{template_id}', [OrderController::class, 'create'])->name('order.create');
Route::post('/order', [OrderController::class, 'store'])->name('order.store');

Route::get('/debug-log', function () {
    $logFile = storage_path('logs/laravel.log');
    if (!file_exists($logFile)) return 'No log file';
    
    $lines = file($logFile);
    $lastLines = array_slice($lines, -100);
    return response("<pre>" . implode("", $lastLines) . "</pre>");
});

// Route::get('/fix-cashflow-data', function() {
//     \App\Models\Cashflow::where('type', 'expense')->where('amount', '>', 0)->update(['amount' => \Illuminate\Support\Facades\DB::raw('-amount')]);
//     return 'Database migrated successfully!';
// });

// Routes untuk SaaS Undangan Digital (Protected by Auth)
Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/admin/invitation-portal', [\App\Http\Controllers\DashboardPortalController::class, 'index']);
    Route::get('/admin/invitation-portal/list', [\App\Http\Controllers\DashboardPortalController::class, 'getInvitations']);
    Route::get('/admin/invitation-portal/statistics', [\App\Http\Controllers\DashboardPortalController::class, 'getStatistics']);
    Route::get('/admin/invitation-portal/templates', [\App\Http\Controllers\DashboardPortalController::class, 'getTemplates']);
    Route::post('/admin/invitation-portal/templates/{id}/duplicate', [\App\Http\Controllers\DashboardPortalController::class, 'duplicateTemplate']);
    Route::post('/admin/invitation-portal/templates/{id}/toggle', [\App\Http\Controllers\DashboardPortalController::class, 'toggleTemplate']);
    Route::post('/admin/invitation-portal/templates/{id}/thumbnail', [\App\Http\Controllers\DashboardPortalController::class, 'updateThumbnail']);

    // Mock Order untuk testing form klien
    // Route::get('/admin/mock-order', function () {
    //     $template = \App\Models\Template::latest('id')->first();
    //     if (!$template) {
    //         return "Silakan simpan sebuah template di Builder terlebih dahulu agar ada template di katalog.";
    //     }
    //     
    //     $order = \App\Models\Order::create([
    //         'template_id' => $template->id,
    //         'package_id' => $template->package_id ?? 1,
    //         'customer_name' => 'Tester Klien ' . rand(100, 999),
    //         'customer_phone' => '081234567890',
    //         'event_date' => now()->addDays(30),
    //         'quantity' => 1,
    //         'status' => 'pending',
    //         'total_price' => $template->price ?? 0,
    //     ]);
    //
    //     return redirect('/admin/invitation-portal?tab=pesanan')->with('success', 'Mock Order berhasil dibuat untuk Template: ' . $template->name);
    // });

    Route::get('/admin/invitation-portal/template-folders', [\App\Http\Controllers\DashboardPortalController::class, 'getTemplateFolders']);
    Route::post('/admin/invitation-portal/template-folders', [\App\Http\Controllers\DashboardPortalController::class, 'storeTemplateFolder']);
    Route::get('/admin/invitation-portal/rsvps', [\App\Http\Controllers\DashboardPortalController::class, 'getRsvps']);
    Route::get('/admin/invitation-portal/{id}/links', [\App\Http\Controllers\DashboardPortalController::class, 'getGuestLinks']);
    Route::post('/admin/invitation-portal/{id}/links', [\App\Http\Controllers\DashboardPortalController::class, 'storeGuestLink']);
    Route::post('/admin/invitation-portal/{id}/links/batch', [\App\Http\Controllers\DashboardPortalController::class, 'storeBatchGuestLinks']);
    Route::post('/admin/invitation-portal/{id}/greeting', [\App\Http\Controllers\DashboardPortalController::class, 'updateGreeting']);
    Route::post('/admin/invitation-portal/{id}/rename', [\App\Http\Controllers\DashboardPortalController::class, 'renameInvitation']);
    Route::delete('/admin/invitation-portal/{id}', [\App\Http\Controllers\DashboardPortalController::class, 'deleteInvitation']);
    Route::post('/admin/invitation-portal/create', [\App\Http\Controllers\DashboardPortalController::class, 'store']);
    Route::get('/admin/builder/{id}', [\App\Http\Controllers\BuilderController::class, 'show']);
    Route::post('/admin/builder/upload-media', [\App\Http\Controllers\BuilderController::class, 'uploadMedia']);
    Route::post('/admin/builder/{id}/autosave', [\App\Http\Controllers\BuilderController::class, 'autoSave']);
    Route::post('/admin/builder/{id}/publish', [\App\Http\Controllers\BuilderController::class, 'publish']);
    Route::get('/admin/builder/global-elements', [\App\Http\Controllers\GlobalElementController::class, 'index']);
    Route::post('/admin/builder/global-elements', [\App\Http\Controllers\GlobalElementController::class, 'store']);
    Route::post('/admin/builder/global-elements/upload', [\App\Http\Controllers\GlobalElementController::class, 'uploadMedia']);
    Route::delete('/admin/builder/global-elements/{id}', [\App\Http\Controllers\GlobalElementController::class, 'destroy']);

    // SaaS Portal Orders Routes
    Route::get('/admin/invitation-portal/orders', [\App\Http\Controllers\DashboardPortalController::class, 'getOrders']);
    Route::post('/admin/invitation-portal/orders/{id}/status', [\App\Http\Controllers\DashboardPortalController::class, 'updateOrderStatus']);
    Route::post('/admin/invitation-portal/orders/{id}/generate-form', [\App\Http\Controllers\DashboardPortalController::class, 'generateOrderForm']);
    Route::post('/admin/invitation-portal/orders/{id}/generate-project', [\App\Http\Controllers\DashboardPortalController::class, 'generateOrderProject']);
    Route::delete('/admin/invitation-portal/orders/{id}', [\App\Http\Controllers\DashboardPortalController::class, 'deleteOrder']);
    Route::post('/admin/invitation-portal/orders/{id}/rename', [\App\Http\Controllers\DashboardPortalController::class, 'renameOrder']);

    Route::get('/admin/builder/user-assets', [\App\Http\Controllers\Api\Builder\UserAssetController::class, 'index']);
    Route::post('/admin/builder/user-assets', [\App\Http\Controllers\Api\Builder\UserAssetController::class, 'store']);
    Route::delete('/admin/builder/user-assets/{id}', [\App\Http\Controllers\Api\Builder\UserAssetController::class, 'destroy']);

    Route::get('/api/builder/client-assets/{invitation_id}', [\App\Http\Controllers\BuilderController::class, 'getClientAssets']);
});

// Auto-save route (menggunakan middleware web untuk dukungan CSRF dari Axios apiClient)
Route::put('/api/builder/invitations/{id}/auto-save', [\App\Http\Controllers\BuilderController::class, 'autoSave']);
Route::post('/api/builder/invitations/{id}/save-as-template', [\App\Http\Controllers\BuilderController::class, 'saveAsTemplate']);

// Route Viewer Engine Publik
Route::get('/client/{slug}', [\App\Http\Controllers\ClientPortalController::class, 'show']);
Route::post('/client/{slug}/links/batch', [\App\Http\Controllers\ClientPortalController::class, 'storeBatchGuestLinks']);
Route::post('/client/{slug}/greeting', [\App\Http\Controllers\ClientPortalController::class, 'updateGreeting']);
Route::delete('/client/{slug}/links/{id}', [\App\Http\Controllers\ClientPortalController::class, 'deleteGuestLink']);

Route::get('/{slug}', [\App\Http\Controllers\ViewerController::class, 'show']);
Route::get('/{slug}/rsvps', [\App\Http\Controllers\ViewerController::class, 'getRsvps']);
Route::post('/{slug}/rsvp', [\App\Http\Controllers\ViewerController::class, 'submitRsvp']);
