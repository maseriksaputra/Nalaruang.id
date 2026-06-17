const fs = require('fs');
const cards = [
    { id: '01', color: 'brand', title: 'Cetak Fisik Premium', link: '/layanan/cetak-fisik', populer: false, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>', items: ['Undangan Pernikahan Eksklusif', 'Custom Lanyard & ID Card', 'Buku Yasin & Majmu premium', 'Jasa Print & Fotocopy Dokumen'] },
    { id: '02', color: 'blue', title: 'Event Digital', link: '/layanan/event-digital', populer: true, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>', items: ['Website Undangan Interaktif', 'Video Undangan Cinematic', 'Buku Tamu Digital (QR Code)', 'RSVP & Filter Instagram Acara'] },
    { id: '03', color: 'purple', title: 'Souvenir & Merchandise', link: '/layanan/souvenir-merchandise', populer: false, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>', items: ['Tumbler & Gelas Kaca Custom', 'Tasbih Premium & Box Estetik', 'Totebag Canvas Sablon', 'Plakat Akrilik & Kayu'] },
    { id: '04', color: 'emerald', title: 'Web & Mobile App', link: '/layanan/web-mobile-app', populer: false, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>', items: ['UI/UX Design & Prototyping', 'Landing Page & Company Profile', 'Aplikasi Bisnis / Kasir Mobile', 'Sistem Reservasi Custom'] }
];

let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">\n';
cards.forEach((c, i) => {
    let delay = (i+1) * 100;
    
    // Tailwind v4 mapping for colors in radial gradients. Tailwind v4 removes `theme()` in standard CSS sometimes if not careful, but `var(--color-brand-300)` is safer in v4. Wait, v4 uses `--color-brand-300`. Let's just hardcode standard HEX for dots to be perfectly safe, or use `var(--color-${c.color}-300)` assuming it works. Let's use `var(--color-${c.color}-300, currentColor)`.
    let dotColor = `var(--color-${c.color}-300)`;
    if(c.color === 'brand') dotColor = '#f9a8d4'; // approximate pink-300
    if(c.color === 'blue') dotColor = '#93c5fd';
    if(c.color === 'purple') dotColor = '#d8b4fe';
    if(c.color === 'emerald') dotColor = '#6ee7b7';

    let populerHtml = c.populer ? `<div class="absolute top-0 right-0 bg-${c.color}-100 text-${c.color}-700 text-[10px] uppercase font-bold px-3 py-1.5 rounded-bl-xl z-20 flex items-center gap-1 shadow-sm"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> TERPOPULER</div>` : '';
    let itemsHtml = c.items.map(item => `<li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-${c.color}-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div>${item}</li>`).join('');
    
    html += `
                <!-- Card ${c.id} -->
                <div class="group relative bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col overflow-hidden h-full cursor-pointer" data-aos="fade-up" data-aos-delay="${delay}">
                    <!-- Badge Number -->
                    <div class="absolute top-0 left-0 bg-${c.color}-500 text-white text-xs font-bold px-4 py-2 rounded-br-2xl z-20 shadow-sm">${c.id}</div>
                    ${populerHtml}
                    
                    <!-- Dot Pattern -->
                    <div class="absolute top-6 right-6 w-20 h-20 opacity-40 z-0" style="background-image: radial-gradient(${dotColor} 2px, transparent 2px); background-size: 10px 10px;"></div>
                    
                    <!-- Wave Background -->
                    <svg class="absolute bottom-0 left-0 w-full text-${c.color}-50 opacity-50 group-hover:opacity-100 transition-opacity duration-700 z-0 transform translate-y-4 group-hover:translate-y-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill="currentColor" fill-opacity="1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,202.7C960,224,1056,224,1152,213.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>

                    <!-- Premium 2.5D Icon -->
                    <div class="relative w-28 h-28 mx-auto mt-6 mb-8 z-10 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 flex items-center justify-center">
                        <div class="absolute inset-0 bg-gradient-to-br from-${c.color}-100 to-white rounded-full shadow-inner opacity-80 group-hover:rotate-12 transition-transform duration-700"></div>
                        <div class="absolute inset-2 bg-gradient-to-tl from-${c.color}-50 to-white rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.05)]"></div>
                        <div class="absolute inset-0 bg-${c.color}-400 opacity-0 group-hover:opacity-15 blur-xl rounded-full transition-opacity duration-500"></div>
                        <svg class="w-12 h-12 text-${c.color}-600 filter drop-shadow-md relative z-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">${c.icon}</svg>
                    </div>

                    <h3 class="text-2xl font-serif text-gray-900 mb-6 relative z-10 text-center group-hover:text-${c.color}-800 transition-colors duration-300">${c.title}</h3>
                    
                    <ul class="text-gray-600 text-[13px] mb-10 space-y-3.5 flex-grow relative z-10 leading-relaxed">
                        ${itemsHtml}
                    </ul>

                    <div class="relative z-10 text-center mt-auto">
                        <a href="${c.link}" class="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-100 text-${c.color}-600 text-sm font-semibold rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] group-hover:bg-${c.color}-500 group-hover:text-white group-hover:border-${c.color}-500 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 w-full sm:w-auto">
                            Detail Layanan <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </a>
                    </div>
                </div>`;
});
html += '\n            </div>';
fs.writeFileSync('d:/laragon/www/Undangan/cards.html', html);
