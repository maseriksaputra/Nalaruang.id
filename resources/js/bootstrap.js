import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import Swal from 'sweetalert2';
window.Swal = Swal;

window.alert = function(message) {
    const isDark = document.documentElement.classList.contains('dark');
    Swal.fire({
        text: message,
        icon: 'info',
        buttonsStyling: false,
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#1e293b',
        padding: '1.5em',
        width: '24em',
        customClass: { 
            popup: 'rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 font-sans', 
            htmlContainer: 'text-sm text-gray-600 dark:text-gray-300 font-sans mt-2',
            confirmButton: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition-colors text-sm mt-5' 
        }
    });
};

window.confirmAsync = async function(message, title='Konfirmasi', isDestructive=true) {
    const isDark = document.documentElement.classList.contains('dark');
    const confirmButtonClass = isDestructive 
        ? 'bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-5 rounded-lg shadow-sm transition-colors text-sm'
        : 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow-sm transition-colors text-sm';
        
    const result = await Swal.fire({
        title: title,
        text: message,
        icon: isDestructive ? 'warning' : 'question',
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: isDestructive ? 'Ya, Hapus' : 'Ya, Lanjutkan',
        cancelButtonText: 'Batal',
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#1e293b',
        padding: '1.5em',
        width: '24em',
        customClass: { 
            popup: 'rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 font-sans', 
            title: 'text-lg font-bold font-sans mt-2',
            htmlContainer: 'text-sm text-gray-500 dark:text-gray-400 font-sans',
            actions: 'mt-6 flex justify-center gap-3',
            confirmButton: confirmButtonClass, 
            cancelButton: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-600 font-medium py-2 px-5 rounded-lg shadow-sm transition-colors text-sm' 
        }
    });
    return result.isConfirmed;
};

window.promptAsync = async function(message, defaultValue='') {
    const isDark = document.documentElement.classList.contains('dark');
    const result = await Swal.fire({
        title: message,
        input: 'text',
        inputValue: defaultValue,
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#1e293b',
        padding: '1.5em',
        width: '26em',
        customClass: { 
            popup: 'rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 font-sans', 
            title: 'text-lg font-bold font-sans mt-2',
            input: 'w-full text-sm font-sans border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 mt-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all', 
            actions: 'mt-6 flex justify-center gap-3',
            confirmButton: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow-sm transition-colors text-sm', 
            cancelButton: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-600 font-medium py-2 px-5 rounded-lg shadow-sm transition-colors text-sm' 
        }
    });
    return result.isConfirmed ? result.value : null;
};
