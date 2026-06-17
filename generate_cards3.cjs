const fs = require('fs');
const cards = [
    { id: '01', color: 'pink', title: 'Cetak Fisik Premium', link: '/layanan/cetak-fisik', populer: false, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>', items: ['Undangan Pernikahan Eksklusif', 'Custom Lanyard & ID Card', 'Buku Yasin & Majmu Premium', 'Jasa Print & Fotocopy Dokumen'] },
    { id: '02', color: 'blue', title: 'Event Digital', link: '/layanan/event-digital', populer: true, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>', items: ['Website Undangan Interaktif', 'Video Undangan Cinematic', 'Buku Tamu Digital (QR Code)', 'RSVP & Filter Instagram Acara'] },
    { id: '03', color: 'purple', title: 'Souvenir & Merchandise', link: '/layanan/souvenir-merchandise', populer: false, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>', items: ['Tumbler & Gelas Kaca Custom', 'Tasbih Premium & Box Estetik', 'Totebag Canvas Sablon', 'Plakat Akrilik & Kayu'] },
    { id: '04', color: 'emerald', title: 'Web & Mobile App', link: '/layanan/web-mobile-app', populer: false, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>', items: ['UI/UX Design & Prototyping', 'Landing Page & Company Profile', 'Aplikasi Bisnis / Kasir Mobile', 'Sistem Reservasi Custom'] }
];

let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">\n';
cards.forEach((c, i) => {
    let delay = (i+1) * 100;
    
    let dotColor = `var(--color-${c.color}-300)`;
    if(c.color === 'brand') dotColor = '#F63EA1'; // Logo gradient end color
    if(c.color === 'blue') dotColor = '#93c5fd';
    if(c.color === 'purple') dotColor = '#d8b4fe';
    if(c.color === 'emerald') dotColor = '#6ee7b7';

    let populerHtml = c.populer ? `<div class="absolute top-0 right-0 bg-${c.color}-100 text-${c.color}-700 text-[10px] uppercase font-bold px-3 py-1.5 rounded-bl-xl z-20 flex items-center gap-1 shadow-sm"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> TERPOPULER</div>` : '';
    let itemsHtml = c.items.map(item => `<li class="flex items-start"><div class="flex-shrink-0 w-4 h-4 rounded-full bg-${c.color}-500 text-white flex items-center justify-center mt-0.5 mr-3 shadow-sm"><svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div><span class="leading-tight">${item}</span></li>`).join('');
    
    html += `
                <!-- Card ${c.id} -->
                <div class="group relative bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col overflow-hidden h-full cursor-pointer" data-aos="fade-up" data-aos-delay="${delay}">
                    <!-- Badge Number -->
                    <div class="absolute top-0 left-0 bg-${c.color}-500 text-white text-xs font-bold px-4 py-2 rounded-br-2xl z-20 shadow-sm">${c.id}</div>
                    ${populerHtml}
                    
                    <!-- Dot Pattern -->
                    <div class="absolute top-6 right-6 w-24 h-24 opacity-50 z-0" style="background-image: radial-gradient(${dotColor} 2.5px, transparent 2.5px); background-size: 12px 12px;"></div>
                    
                    <!-- Gradient Blobs for dynamic background -->
                    <div class="absolute -bottom-10 -right-10 w-48 h-48 bg-${c.color}-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 group-hover:opacity-70 transition-opacity duration-700"></div>
                    <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-${c.color}-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-60 transition-opacity duration-700 delay-100"></div>

                    <!-- Multi-layer Wave Background -->
                    <svg class="absolute bottom-0 left-0 w-full opacity-60 group-hover:opacity-100 transition-opacity duration-700 z-0 transform translate-y-2 group-hover:translate-y-0" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path class="text-${c.color}-100" fill="currentColor" fill-opacity="0.5" d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,149.3C672,139,768,149,864,165.3C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        <path class="text-${c.color}-200" fill="currentColor" fill-opacity="0.4" d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,234.7C672,235,768,213,864,197.3C960,181,1056,149,1152,144C1248,139,1344,160,1392,170.7L1440,181L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        <path class="text-${c.color}-300" fill="currentColor" fill-opacity="0.3" d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,229.3C672,224,768,192,864,186.7C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>

                    <!-- Premium 2.5D Icon (Centered) -->
                    <div class="relative w-24 h-24 mx-auto mt-8 mb-6 z-10 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 flex items-center justify-center">
                        <div class="absolute inset-0 bg-gradient-to-br from-${c.color}-100 to-white rounded-full shadow-inner opacity-90 group-hover:rotate-12 transition-transform duration-700"></div>
                        <div class="absolute inset-2 bg-gradient-to-tl from-${c.color}-50 to-white rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.05)]"></div>
                        <div class="absolute inset-0 bg-${c.color}-400 opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-opacity duration-500"></div>
                        <svg class="w-10 h-10 text-${c.color}-600 filter drop-shadow-md relative z-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">${c.icon}</svg>
                    </div>

                    <!-- Content -->
                    <div class="relative z-10 flex-grow flex flex-col">
                        <h3 class="text-xl font-serif font-bold text-gray-900 mb-5 text-center group-hover:text-${c.color}-800 transition-colors duration-300">${c.title}</h3>
                        
                        <ul class="text-gray-600 text-[13px] mb-8 space-y-3 flex-grow leading-relaxed text-left">
                            ${itemsHtml}
                        </ul>

                        <div class="mt-auto text-center w-full">
                            <a href="${c.link}" class="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-100 text-${c.color}-600 text-sm font-semibold rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] group-hover:bg-${c.color}-500 group-hover:text-white group-hover:border-${c.color}-500 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 w-full sm:w-auto">
                                Detail Layanan <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>`;
});
html += '\n            </div>';
fs.writeFileSync('d:/laragon/www/Undangan/cards3.html', html);

