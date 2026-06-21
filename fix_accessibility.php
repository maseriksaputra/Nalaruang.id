<?php
$content = file_get_contents('resources/views/landing.blade.php');

// Add aria-label to buttons
$content = str_replace('<button x-show="canScrollLeft" @click="scrollLeft()" class="', '<button aria-label="Geser ke kiri" x-show="canScrollLeft" @click="scrollLeft()" class="', $content);
$content = str_replace('<button x-show="canScrollRight" @click="scrollRight()" class="', '<button aria-label="Geser ke kanan" x-show="canScrollRight" @click="scrollRight()" class="', $content);
$content = str_replace('<button @click.prevent="prev()" class="w-6', '<button aria-label="Gambar sebelumnya" @click.prevent="prev()" class="w-6', $content);
$content = str_replace('<button @click.prevent="next()" class="w-6', '<button aria-label="Gambar selanjutnya" @click.prevent="next()" class="w-6', $content);
$content = str_replace('<button @click.prevent.stop="$dispatch(\'open-lightbox\'', '<button aria-label="Buka ukuran penuh" @click.prevent.stop="$dispatch(\'open-lightbox\'', $content);

// Add aria-label to WA Link
$content = str_replace('<a href="https://wa.me/6285196811112?text=Halo%20Tim%20Nalaruang,%20saya%20ingin%20bertanya%20terkait%20layanan%20Anda." target="_blank" class="bg-brand-600', '<a aria-label="Hubungi kami via WhatsApp" href="https://wa.me/6285196811112?text=Halo%20Tim%20Nalaruang,%20saya%20ingin%20bertanya%20terkait%20layanan%20Anda." target="_blank" class="bg-brand-600', $content);

// Footer Contrast Fix
$content = str_replace('<footer id="kontak" class="bg-brand-900 text-gray-300', '<footer id="kontak" class="bg-brand-900 text-pink-50', $content);
$content = str_replace('<p class="text-sm text-gray-400 leading-relaxed max-w-sm">', '<p class="text-sm text-pink-100/80 leading-relaxed max-w-sm">', $content);
$content = str_replace('text-gray-400', 'text-pink-100/80', $content);

// Add Width and Height to Images
$content = str_replace('<img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1920" alt="Pernikahan" class="', '<img width="1920" height="1080" src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1920" alt="Pernikahan" class="', $content);
$content = str_replace('<img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1920" alt="Cincin Kawin" class="', '<img width="1920" height="1080" src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1920" alt="Cincin Kawin" class="', $content);
$content = str_replace('<img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1920" alt="Digital Printing" class="', '<img width="1920" height="1080" src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1920" alt="Digital Printing" class="', $content);
$content = str_replace('<img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1920" alt="Web Development IT" class="', '<img width="1920" height="1080" src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1920" alt="Web Development IT" class="', $content);
$content = str_replace('<img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=1920" alt="Souvenir Acara" class="', '<img width="1920" height="1080" src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=1920" alt="Souvenir Acara" class="', $content);

$content = str_replace('<img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Client" class="', '<img width="100" height="100" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Client" loading="lazy" class="', $content);
$content = str_replace('<img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Client" class="', '<img width="100" height="100" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Client" loading="lazy" class="', $content);
$content = str_replace('<img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" alt="Client" class="', '<img width="100" height="100" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" alt="Client" loading="lazy" class="', $content);

$content = str_replace('<img src="{{ $portfolio->image ? Storage::url($portfolio->image) : \'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000\' }}"', '<img width="600" height="400" loading="lazy" src="{{ $portfolio->image ? Storage::url($portfolio->image) : \'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000\' }}"', $content);

// For the logo images
$content = str_replace('<img src="{{ asset(\'logo.png\') }}" alt="Nalaruang.id" class="h-20 w-auto', '<img width="200" height="80" src="{{ asset(\'logo.png\') }}" alt="Nalaruang.id" class="h-20 w-auto', $content);
$content = str_replace('<img src="{{ asset(\'logo.png\') }}" alt="Nalaruang.id" class="h-28 w-auto', '<img width="280" height="112" src="{{ asset(\'logo.png\') }}" alt="Nalaruang.id" class="h-28 w-auto', $content);

file_put_contents('resources/views/landing.blade.php', $content);
echo "DONE\n";
