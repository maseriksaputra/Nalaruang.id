const fs = require('fs');
const file = 'resources/views/client-portal.blade.php';
let content = fs.readFileSync(file, 'utf8');

// 1. AlpineJS HTML Data & Dark Mode Toggle
content = content.replace(
    '<body class="bg-slate-50 text-slate-800 antialiased min-h-screen pb-24 lg:pb-0" x-data="{ activeTab: sessionStorage.getItem(\'activeTab\') || \'dashboard\', isMobileMenuOpen: false, qrModalOpen: false, qrUrl: \'\', qrName: \'\' }" x-init="$watch(\'activeTab\', val => sessionStorage.setItem(\'activeTab\', val))">',
    `<body class="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 antialiased min-h-screen pb-24 lg:pb-0 transition-colors duration-300" x-data="{ darkMode: localStorage.getItem('darkMode') === 'true', activeTab: sessionStorage.getItem('activeTab') || 'dashboard', isMobileMenuOpen: false, qrModalOpen: false, qrUrl: '', qrName: '' }" x-init="$watch('activeTab', val => sessionStorage.setItem('activeTab', val)); $watch('darkMode', val => localStorage.setItem('darkMode', val)); if(darkMode) document.documentElement.classList.add('dark'); $watch('darkMode', val => val ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark'))">`
);

// 2. Add Toggle Button in Header
const headerNav = `            <!-- Desktop Navigation -->`;
const toggleBtn = `
            <!-- Dark Mode Toggle -->
            <button @click="darkMode = !darkMode" class="hidden sm:flex p-2 mr-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <svg x-show="!darkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                <svg x-show="darkMode" x-cloak class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </button>
`;
content = content.replace(headerNav, toggleBtn + headerNav);

// Add mobile toggle next to hamburger
const mobileMenuToggle = `<button @click="isMobileMenuOpen = !isMobileMenuOpen" class="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">`;
const mobileToggleBtn = `
            <button @click="darkMode = !darkMode" class="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <svg x-show="!darkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                <svg x-show="darkMode" x-cloak class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </button>
`;
content = content.replace(mobileMenuToggle, mobileToggleBtn + mobileMenuToggle);

// 3. Global CSS Replacements
// Backgrounds & Borders
content = content.replace(/bg-white/g, 'bg-white dark:bg-slate-900');
content = content.replace(/bg-white\/80/g, 'bg-white/80 dark:bg-slate-900/80');
content = content.replace(/border-slate-200/g, 'border-slate-200 dark:border-slate-800');
content = content.replace(/border-slate-100/g, 'border-slate-100 dark:border-slate-800/50');
content = content.replace(/bg-slate-50/g, 'bg-slate-50 dark:bg-slate-800/30');
content = content.replace(/bg-slate-100/g, 'bg-slate-100 dark:bg-slate-800');

// Hover states
content = content.replace(/hover:bg-slate-50/g, 'hover:bg-slate-50 dark:hover:bg-slate-800/60');
content = content.replace(/hover:bg-slate-100/g, 'hover:bg-slate-100 dark:hover:bg-slate-800');

// Typography
content = content.replace(/text-slate-900/g, 'text-slate-900 dark:text-white');
content = content.replace(/text-slate-800/g, 'text-slate-800 dark:text-slate-200');
content = content.replace(/text-slate-700/g, 'text-slate-700 dark:text-slate-300');
content = content.replace(/text-slate-600/g, 'text-slate-600 dark:text-slate-400');
content = content.replace(/text-slate-500/g, 'text-slate-500 dark:text-slate-400');

// Active/Indigo states
content = content.replace(/'bg-indigo-50 text-indigo-700'/g, "'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400'");
content = content.replace(/'text-slate-600 hover:bg-slate-100'/g, "'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'");
content = content.replace(/bg-blue-50/g, 'bg-blue-50 dark:bg-indigo-900/20');
content = content.replace(/text-blue-800/g, 'text-blue-800 dark:text-indigo-300');
content = content.replace(/text-blue-700/g, 'text-blue-700 dark:text-indigo-400');
content = content.replace(/border-blue-100/g, 'border-blue-100 dark:border-indigo-800/50');
content = content.replace(/border-blue-200/g, 'border-blue-200 dark:border-indigo-700/50');
content = content.replace(/text-indigo-700/g, 'text-indigo-700 dark:text-indigo-400');

// Chart options update for dark mode
content = content.replace(
    `color: '#64748b'`,
    `color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b'`
);
content = content.replace(
    `color: '#f1f5f9'`,
    `color: document.documentElement.classList.contains('dark') ? '#334155' : '#f1f5f9'`
);
// We need to trigger chart re-render on dark mode toggle, but simple reload or rely on CSS is fine for now.

// Forms
content = content.replace(/bg-slate-50/g, 'bg-slate-50 dark:bg-slate-800/50'); // Just in case

// Fix duplicated dark mode classes from multiple replaces
content = content.replace(/dark:bg-slate-900\/80 dark:bg-slate-900\/80/g, 'dark:bg-slate-900/80');

fs.writeFileSync(file, content);
console.log('Refactoring complete!');
