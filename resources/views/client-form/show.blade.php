@extends('layouts.main')

@section('content')
<div class="min-h-screen bg-sand py-12 md:py-24">
    <div class="max-w-3xl mx-auto px-4 sm:px-6">
        
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <!-- Header -->
            <div class="bg-brand-900 px-6 py-10 md:px-10 md:py-12 text-center relative overflow-hidden">
                <div class="absolute inset-0 opacity-10" style="background-image: url('https://www.transparenttextures.com/patterns/stardust.png');"></div>
                <div class="relative z-10">
                    <h1 class="text-3xl md:text-4xl font-serif text-white mb-3">Form Data Klien</h1>
                    <p class="text-brand-100 text-sm md:text-base leading-relaxed">Halo <strong>{{ $order->customer_name }}</strong>, silakan lengkapi data dan aset di bawah ini untuk memproses pesanan <strong>{{ $template->name }}</strong> Anda.</p>
                </div>
            </div>

            <!-- Form Body -->
            <div class="p-6 sm:p-8 md:p-10">
                @if(session('success'))
                    <div class="bg-green-50 text-green-800 p-4 rounded-xl mb-8 flex items-start">
                        <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p class="text-sm font-medium">{{ session('success') }}</p>
                    </div>
                @endif

                @if($errors->any())
                    <div class="bg-red-50 text-red-800 p-4 rounded-xl mb-8">
                        <div class="flex items-start mb-2">
                            <svg class="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <p class="text-sm font-bold">Mohon perbaiki kesalahan berikut:</p>
                        </div>
                        <ul class="list-disc list-inside text-sm ml-8">
                            @foreach($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                @if(empty($schema))
                    <div class="text-center py-10">
                        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <h3 class="text-xl font-serif text-brand-900 mb-2">Tidak Ada Data Tambahan</h3>
                        <p class="text-gray-500 text-sm">Template ini tidak membutuhkan form pengisian tambahan.</p>
                    </div>
                @else
                    <form action="{{ route('client.form.submit', $order->form_token) }}" method="POST" enctype="multipart/form-data" class="space-y-8">
                        @csrf
                        
                        @foreach($schema as $field)
                            @php
                                $fieldName = \Illuminate\Support\Str::slug($field['field_name'], '_');
                                $isRequired = !empty($field['is_required']);
                            @endphp

                            <div>
                                <label class="block text-sm font-semibold text-gray-800 mb-2">
                                    {{ $field['field_name'] }}
                                    @if($isRequired) <span class="text-red-500">*</span> @endif
                                </label>

                                @if($field['type'] === 'text')
                                    <input type="text" name="{{ $fieldName }}" class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200" {{ $isRequired ? 'required' : '' }} value="{{ old($fieldName) }}" placeholder="Masukkan {{ strtolower($field['field_name']) }}...">
                                
                                @elseif($field['type'] === 'audio')
                                    <div class="mt-1">
                                        <input type="file" name="{{ $fieldName }}" accept="audio/mpeg, audio/wav, audio/*" class="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 transition-colors cursor-pointer" {{ $isRequired ? 'required' : '' }}>
                                        <p class="mt-2 text-xs text-gray-500">Unggah file audio format MP3 atau WAV.</p>
                                    </div>
                                
                                @elseif($field['type'] === 'textarea')
                                    <textarea name="{{ $fieldName }}" rows="4" class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200" {{ $isRequired ? 'required' : '' }} placeholder="Tuliskan {{ strtolower($field['field_name']) }} di sini...">{{ old($fieldName) }}</textarea>
                                
                                @elseif($field['type'] === 'image')
                                    <div x-data="imageUpload()" class="mt-1">
                                        <label class="flex flex-col items-center justify-center px-6 pt-6 pb-8 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-brand-50 hover:border-brand-300 transition-colors duration-200 cursor-pointer w-full">
                                            <div class="space-y-2 text-center">
                                                <svg class="mx-auto h-12 w-12" :class="files.length > 0 ? 'text-brand-500' : 'text-gray-400'" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                <div class="flex text-sm text-gray-600 justify-center">
                                                    <div class="relative font-semibold text-brand-600 hover:text-brand-500">
                                                        <span x-text="files.length > 0 ? files.length + ' file dipilih (Klik untuk menambah/mengganti)' : 'Pilih file dari perangkat'"></span>
                                                        <input x-ref="fileInput" @change="handleFiles($event)" name="{{ $fieldName }}[]" type="file" class="sr-only" accept="image/*,video/mp4,video/quicktime" {{ $isRequired ? 'required' : '' }} {{ ($field['max_files'] ?? 1) > 1 || ($field['max_files'] ?? 0) === 0 ? 'multiple' : '' }}>
                                                    </div>
                                                </div>
                                                <p class="text-xs text-gray-500">
                                                    Format: PNG, JPG, GIF, MP4. 
                                                    @if(isset($field['max_files']) && $field['max_files'] > 0)
                                                        (Maksimal {{ $field['max_files'] }} file)
                                                    @endif
                                                </p>
                                            </div>
                                        </label>
                                        
                                        <!-- Preview Grid -->
                                        <template x-if="files.length > 0">
                                            <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                <template x-for="(item, index) in files" :key="index">
                                                    <div class="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                                                        <template x-if="item.file.type.startsWith('video/')">
                                                            <video :src="item.preview" class="w-full h-full object-contain bg-black" controls></video>
                                                        </template>
                                                        <template x-if="!item.file.type.startsWith('video/')">
                                                            <img :src="item.preview" class="w-full h-full object-contain bg-gray-200/50" />
                                                        </template>
                                                        <button type="button" @click.stop="removeFile(index)" class="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-1.5 shadow-sm transition-transform hover:scale-110 z-10" title="Hapus file ini">
                                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                        </button>
                                                        <div class="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1.5 truncate text-[10px] text-white" x-text="item.file.name"></div>
                                                    </div>
                                                </template>
                                            </div>
                                        </template>
                                    </div>
                                @endif
                            </div>
                        @endforeach

                        <div class="pt-8 border-t border-gray-100">
                            <button type="submit" class="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-brand-800 hover:bg-brand-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition transform hover:-translate-y-0.5">
                                Kirim Data & Proses Desain
                            </button>
                            <div class="bg-blue-50 text-blue-800 p-4 rounded-xl mt-6 flex items-start text-sm">
                                <svg class="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p>Pastikan data sudah benar sebelum dikirim, karena link ini hanya bisa diisi satu kali untuk menjaga keamanan data Anda.</p>
                            </div>
                        </div>
                    </form>
                @endif
            </div>
        </div>
        
    </div>
</div>

<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('imageUpload', () => ({
        files: [],
        handleFiles(event) {
            const selectedFiles = Array.from(event.target.files);
            // Append new files to existing ones
            const newFiles = selectedFiles.map(file => ({
                file: file,
                preview: URL.createObjectURL(file)
            }));
            this.files = [...this.files, ...newFiles];
            this.updateInput();
        },
        removeFile(index) {
            URL.revokeObjectURL(this.files[index].preview);
            this.files.splice(index, 1);
            this.updateInput();
        },
        updateInput() {
            const dt = new DataTransfer();
            this.files.forEach(f => dt.items.add(f.file));
            this.$refs.fileInput.files = dt.files;
        }
    }))
})
</script>
@endsection
