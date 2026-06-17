<!DOCTYPE html>
<html lang="id">
<head>
    <link rel="icon" href="{{ asset('logo1.png') }}" type="image/png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Undangan Tidak Tersedia</title>
    @vite(['resources/css/app.css'])
</head>
<body class="bg-[#0f172a] min-h-screen flex items-center justify-center p-4 font-sans text-gray-200">
    <div class="max-w-md w-full bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden border border-[#334155] text-center p-8 animate-in zoom-in duration-500">
        <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h1 class="text-2xl font-bold text-white mb-3">Tautan Tidak Tersedia</h1>
        <p class="text-gray-400 mb-8 leading-relaxed">
            Mohon maaf, halaman undangan yang Anda tuju sudah tidak aktif atau masa berlakunya telah berakhir.
        </p>
        <a href="/" class="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-lg hover:shadow-indigo-500/25">
            Kembali ke Beranda
        </a>
    </div>
</body>
</html>
