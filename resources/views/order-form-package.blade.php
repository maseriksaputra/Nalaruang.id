@extends('layouts.main')

@section('content')
<section class="py-32 bg-sand min-h-screen">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center mb-10" data-aos="fade-up">
            <h1 class="text-3xl md:text-4xl font-serif text-brand-900 mb-4">Formulir Pemesanan</h1>
            <p class="text-gray-500">Silakan lengkapi data di bawah ini untuk memulai proses pembuatan desain Anda.</p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl overflow-hidden" data-aos="fade-up" data-aos-delay="100">
            <!-- Review Pesanan -->
            @php
                $finalPrice = $package->price;
            @endphp
            <div class="p-8 bg-brand-900 text-white flex flex-col sm:flex-row items-center gap-6">
                <div class="w-24 h-32 bg-brand-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-brand-200 text-xs font-bold uppercase text-center p-2">
                    {{ $package->name }}
                </div>
                <div class="flex-grow text-center sm:text-left">
                    <span class="text-brand-500 text-xs font-bold uppercase tracking-wider">{{ $package->service->title ?? 'Layanan' }}</span>
                    <h2 class="text-2xl font-serif mt-1 mb-2">Paket {{ $package->name }}</h2>
                </div>
                <div class="text-center sm:text-right">
                    <p class="text-brand-500 text-sm mb-1">Total Biaya</p>
                    <p class="text-2xl font-bold">Rp {{ number_format($finalPrice, 0, ',', '.') }}</p>
                </div>
            </div>

            <!-- Form Inputs -->
            <form action="{{ route('order.package.store') }}" method="POST" class="p-8 md:p-12">
                @csrf
                <input type="hidden" name="package_id" value="{{ $package->id }}">

                @if ($errors->any())
                    <div class="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                        <ul class="list-disc pl-5">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
                
                @php
                    $formType = ($package->service->slug === 'event-digital') ? 'undangan' : 'print';
                @endphp

                <!-- 1. Data Pemesan -->
                <h3 class="text-xl font-serif text-brand-900 mb-6 pb-2 border-b border-gray-100">1. Data Pemesan</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                        <input type="text" name="customer_name" required class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" placeholder="Masukkan nama Anda">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nomor WhatsApp</label>
                        <input type="tel" name="customer_phone" required class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" placeholder="Contoh: 081234567890">
                    </div>
                </div>

                <!-- 2. Detail Pesanan Spesifik -->
                <h3 class="text-xl font-serif text-brand-900 mb-6 pb-2 border-b border-gray-100">2. Detail Pesanan</h3>

                <div class="space-y-6 mb-10" x-data="{ 
                    quantity: 1, 
                    basePrice: {{ $finalPrice }},
                    jenisKertas: 'Art Carton 260gsm',
                    laminasi: 'Tanpa Laminasi',
                    kustomWarna: false,
                    kustomElemen: false,
                    jumlahHalaman: '128 Halaman',
                    kertasIsi: 'HVS 70gsm',
                    sikuSudut: false,
                    printWarna: 'Hitam Putih',
                    kertasPrint: 'HVS 75gsm',
                    jilidPrint: 'Tidak Dijilid',
                    
                    get totalPrice() {
                        let price = this.basePrice;
                        let addonsPerItem = 0;
                        let addonsFlat = 0;
                        
                        let type = '{{ $formType }}';
                        let service = '{{ $package->service->slug ?? '' }}';
                        
                        if (type === 'undangan' && service !== 'event-digital') {
                            if (this.jenisKertas === 'Jasmine') addonsPerItem += 500;
                            if (this.jenisKertas === 'Brief Card') addonsPerItem += 300;
                            if (this.laminasi === 'Glossy') addonsPerItem += 200;
                            if (this.laminasi === 'Doff') addonsPerItem += 200;
                            
                            if (this.kustomWarna) addonsFlat += 50000;
                            if (this.kustomElemen) addonsFlat += 100000;
                        }
                        
                        if (type === 'yasin') {
                            if (this.jumlahHalaman === '144 Halaman') addonsPerItem += 2000;
                            if (this.jumlahHalaman === '176 Halaman') addonsPerItem += 4000;
                            
                            if (this.kertasIsi === 'Matte Paper') addonsPerItem += 3000;
                            if (this.kertasIsi === 'Art Paper') addonsPerItem += 5000;
                            
                            if (this.sikuSudut) addonsPerItem += 1500;
                        }
                        
                        if (type === 'print') {
                            if (this.printWarna === 'Full Color') addonsPerItem += 1000;
                            if (this.kertasPrint === 'HVS 80gsm') addonsPerItem += 100;
                            if (this.kertasPrint === 'Art Paper') addonsPerItem += 500;
                            
                            if (this.jilidPrint === 'Lakban/Kertas') addonsFlat += 5000;
                            if (this.jilidPrint === 'Softcover') addonsFlat += 15000;
                            if (this.jilidPrint === 'Spiral') addonsFlat += 20000;
                            if (this.jilidPrint === 'Hardcover') addonsFlat += 35000;
                        }
                        
                        return ((price + addonsPerItem) * this.quantity) + addonsFlat;
                    }
                }">
                    
                    <!-- Form Undangan -->
                    @if($formType == 'undangan')
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            @if($package->service && $package->service->slug != 'event-digital')
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Acara</label>
                                <input type="date" name="event_date" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Kuantitas / Jumlah Cetak</label>
                                <input type="number" name="quantity" x-model="quantity" min="1" required class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" placeholder="Misal: 500">
                                <p class="text-xs text-gray-500 mt-1">Kosongkan jika memesan undangan digital.</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kertas</label>
                                <select name="jenis_kertas" x-model="jenisKertas" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition">
                                    <option value="Art Carton 260gsm">Art Carton 260gsm (Standar)</option>
                                    <option value="Jasmine">Kertas Jasmine (+Rp 500/pcs)</option>
                                    <option value="Brief Card">Brief Card (+Rp 300/pcs)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Laminasi (Pelapis Kertas)</label>
                                <select name="laminasi" x-model="laminasi" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition">
                                    <option value="Tanpa Laminasi">Tanpa Laminasi (Standar)</option>
                                    <option value="Glossy">Laminasi Glossy (+Rp 200/pcs)</option>
                                    <option value="Doff">Laminasi Doff (+Rp 200/pcs)</option>
                                </select>
                            </div>
                            @endif
                        </div>
                        
                        @if($package->service && $package->service->slug != 'event-digital')
                        <div class="mt-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Salin (Copy-Paste) Daftar Tamu Anda di sini</label>
                            <p class="text-xs text-gray-500 mb-2">Satu nama tamu per baris. Boleh dikosongkan terlebih dahulu jika belum siap.</p>
                            <textarea name="guest_list" rows="8" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" placeholder="Contoh:&#10;Bapak Budi & Keluarga&#10;Ibu Siska&#10;Andi & Partner"></textarea>
                        </div>
                        @else
                        <div class="mt-6 bg-brand-50 border border-brand-100 rounded-lg p-4 text-sm text-brand-800">
                            <p><strong>Informasi:</strong> Untuk Detail Acara (Tanggal, Lokasi) dan Daftar Tamu, Anda akan mengisi <strong>Formulir Khusus</strong> yang lebih lengkap dan interaktif setelah pesanan ini masuk.</p>
                        </div>
                        @endif
                        
                        @if($package->is_customizable || strtolower(trim($package->name)) === 'custom vip')
                        <div class="mt-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Request Custom Tambahan</label>
                            <textarea name="custom_requests" rows="4" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" placeholder="Contoh: Tolong ganti warna pita jadi merah maroon..."></textarea>
                            
                            @if($package->service && $package->service->slug != 'event-digital')
                            <div class="mt-4 flex flex-col gap-3">
                                <label class="flex items-center gap-3">
                                    <input type="checkbox" name="kustom_warna" value="Ya" x-model="kustomWarna" class="w-5 h-5 text-brand-600 rounded focus:ring-brand-500">
                                    <span class="text-sm text-gray-700">Kustom Warna Dominan (+Rp 50.000)</span>
                                </label>
                                <label class="flex items-center gap-3">
                                    <input type="checkbox" name="kustom_elemen" value="Ya" x-model="kustomElemen" class="w-5 h-5 text-brand-600 rounded focus:ring-brand-500">
                                    <span class="text-sm text-gray-700">Kustom Elemen Desain / Layout (+Rp 100.000)</span>
                                </label>
                            </div>
                            @endif
                        </div>
                        @else
                        <div class="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-500">
                            <p><strong>Catatan:</strong> Paket {{ $package->name ?? 'ini' }} tidak menyertakan fitur kustomisasi desain. Jika Anda membutuhkan fitur kustomisasi, silakan pilih desain dari paket Premium atau custom.</p>
                        </div>
                        @endif
                    @endif

                    <!-- Form Yasin -->
                    @if($formType == 'yasin')
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Kuantitas / Jumlah Cetak</label>
                                <input type="number" name="quantity" x-model="quantity" min="1" required class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" placeholder="Misal: 100">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah Halaman</label>
                                <select name="jumlah_halaman" x-model="jumlahHalaman" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition">
                                    <option value="128 Halaman">128 Halaman (Standar)</option>
                                    <option value="144 Halaman">144 Halaman (+Rp 2.000/pcs)</option>
                                    <option value="176 Halaman">176 Halaman (+Rp 4.000/pcs)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kertas Isi</label>
                                <select name="kertas_isi" x-model="kertasIsi" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition">
                                    <option value="HVS 70gsm">HVS 70gsm (Standar)</option>
                                    <option value="Matte Paper">Matte Paper (+Rp 3.000/pcs)</option>
                                    <option value="Art Paper">Art Paper (+Rp 5.000/pcs)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Aksesoris Tambahan</label>
                                <label class="flex items-center gap-3 mt-3">
                                    <input type="checkbox" name="siku_sudut" value="Ya" x-model="sikuSudut" class="w-5 h-5 text-brand-600 rounded focus:ring-brand-500">
                                    <span class="text-sm text-gray-700">Siku Sudut Emas (+Rp 1.500/pcs)</span>
                                </label>
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nama Almarhum/ah (Untuk di Cover/Sisipan)</label>
                                <input type="text" name="nama_almarhum" required class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" placeholder="Contoh: Fulan bin Fulan">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Salin (Copy-Paste) Daftar Keluarga Yang Berduka / Susunan Acara</label>
                                <textarea name="guest_list" rows="6" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" placeholder="Anda juga bisa mengosongkan ini dan mengirim file via WhatsApp."></textarea>
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Request Tambahan</label>
                                <textarea name="custom_requests" rows="3" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" placeholder="Contoh: Tolong pakai font arab yang jelas..."></textarea>
                            </div>
                        </div>
                    @endif

                    <!-- Form Lanyard -->
                    @if($formType == 'lanyard')
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Kuantitas Lanyard/ID Card (Pcs)</label>
                                <input type="number" name="quantity" x-model="quantity" min="1" required class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" placeholder="Min order: 10">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Warna Tali Lanyard</label>
                                <input type="text" name="warna_lanyard" required class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" placeholder="Contoh: Hitam, Biru Navy, dll">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Instruksi Desain Lanyard / Casing</label>
                                <textarea name="custom_requests" rows="3" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" placeholder="Jelaskan kebutuhan Anda atau beri tahu kami jika Anda akan mengirimkan file desain melalui WA."></textarea>
                            </div>
                        </div>
                    @endif

                    <!-- Form Print / Fotocopy -->
                    @if($formType == 'print')
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Berapa Halaman? / Copies</label>
                                <input type="number" name="quantity" x-model="quantity" min="1" required class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" placeholder="Masukkan total halaman/copy">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Cetak Warna</label>
                                <select name="print_warna" x-model="printWarna" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition">
                                    <option value="Hitam Putih">Hitam Putih (Standar)</option>
                                    <option value="Full Color">Full Color (+Rp 1.000/hal)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Jenis / Ukuran Kertas</label>
                                <select name="kertas_print" x-model="kertasPrint" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition">
                                    <option value="HVS 75gsm">HVS 75gsm (Standar)</option>
                                    <option value="HVS 80gsm">HVS 80gsm (+Rp 100/hal)</option>
                                    <option value="Art Paper">Art Paper (+Rp 500/hal)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Pilihan Jilid</label>
                                <select name="jilid" x-model="jilidPrint" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition">
                                    <option value="Tidak Dijilid">Tidak Dijilid</option>
                                    <option value="Lakban/Kertas">Jilid Lakban/Kertas Biasa (+Rp 5.000 Flat)</option>
                                    <option value="Softcover">Jilid Softcover (+Rp 15.000 Flat)</option>
                                    <option value="Spiral">Jilid Spiral (+Rp 20.000 Flat)</option>
                                    <option value="Hardcover">Jilid Hardcover/Skripsi (+Rp 35.000 Flat)</option>
                                </select>
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Catatan Khusus (Print)</label>
                                <textarea name="custom_requests" rows="3" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" placeholder="Contoh: Halaman 1-5 print warna, sisanya hitam putih. (Catatan: Anda akan diarahkan ke WhatsApp untuk mengirim file dokumennya)"></textarea>
                            </div>
                        </div>
                    @endif

                    <!-- Harga Total Dinamis -->
                    <div class="mt-8 pt-6 border-t border-gray-200">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Estimasi Total Harga:</span>
                            <span class="text-3xl font-bold text-brand-600">
                                Rp <span x-text="totalPrice.toLocaleString('id-ID')"></span>
                            </span>
                            <input type="hidden" name="calculated_total" x-bind:value="totalPrice">
                        </div>
                        <p class="text-xs text-right text-gray-400 mt-1">*Harga akhir mungkin menyesuaikan dengan kerumitan desain/request tambahan.</p>
                    </div>
                </div>

                <div class="bg-brand-50 rounded-xl p-6 mb-8 flex items-start gap-4">
                    <svg class="w-6 h-6 text-brand-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p class="text-sm text-brand-700">
                        Setelah menekan tombol di bawah, pesanan Anda akan tersimpan di sistem kami dan Anda akan langsung diarahkan ke WhatsApp Admin untuk mengirimkan foto-foto (prewedding/mempelai) serta melakukan konfirmasi.
                    </p>
                </div>

                <div class="flex justify-end gap-4">
                    <a href="{{ url()->previous() }}" class="px-8 py-3.5 border border-gray-300 text-gray-600 rounded-full text-sm font-semibold hover:bg-gray-50 transition">Kembali</a>
                    <button type="submit" class="px-8 py-3.5 bg-brand-600 text-white rounded-full text-sm font-bold shadow-lg hover:bg-brand-700 transition transform hover:-translate-y-1">
                        Simpan & Hubungi Admin (WA)
                    </button>
                </div>
            </form>
        </div>
    </div>
</section>
@endsection
