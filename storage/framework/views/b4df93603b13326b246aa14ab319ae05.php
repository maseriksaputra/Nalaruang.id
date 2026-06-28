<style>
    /* Hover Animation untuk Sidebar */
    .fi-sidebar-item > a {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    .fi-sidebar-item > a:hover {
        background-color: rgba(var(--primary-500), 0.1) !important;
        transform: translateX(6px) !important;
        color: rgb(var(--primary-600)) !important;
    }
    .fi-sidebar-item > a:hover .fi-icon {
        color: rgb(var(--primary-600)) !important;
        transform: scale(1.1);
        transition: transform 0.2s ease-in-out;
    }
    
    /* Efek Menyala (Glow) untuk Item Aktif hanya ketika sidebar terbuka atau hover */
    .fi-sidebar-item-active > a {
        background-color: rgba(var(--primary-500), 0.1) !important;
        box-shadow: inset 4px 0 0 0 rgb(var(--primary-600)) !important;
        color: rgb(var(--primary-600)) !important;
        font-weight: bold !important;
    }
    .fi-sidebar-item-active > a .fi-icon {
        color: rgb(var(--primary-600)) !important;
    }
    
    /* Perbaikan Group Header Table agar membentang 100% */
    .fi-ta-group-header {
        width: 100%;
    }
    .fi-ta-group-header h4 {
        width: 100% !important;
        display: flex;
    }
    .fi-ta-group-header h4 > span:last-child {
        width: 100%;
    }
    /* Grup Navigation Font */
    .fi-sidebar-group-label {
        color: rgb(var(--primary-600)) !important;
        font-weight: bold !important;
        opacity: 0.8;
    }

    /* Fix Stats Overview Icon overlapping */
    .fi-wi-stats-overview-stat-description-icon {
        margin-right: 0.25rem !important;
        width: 1rem !important;
        height: 1rem !important;
    }

    /* Perbaikan Group Header Table agar membentang 100% untuk Total Masuk/Keluar */
    .fi-ta-group-header {
        width: 100%;
    }
    .fi-ta-group-header h4 {
        width: 100% !important;
        display: flex;
    }
    .fi-ta-group-header h4 > span:last-child {
        width: 100%;
    }

    /* Efek Wipe (Sapuan) Kiri ke Kanan untuk Grafik Dashboard */
    @keyframes wipeReveal {
        0% {
            clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
        }
        100% {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
    }
    .fi-wi-chart canvas {
        animation: wipeReveal 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
    }
    
    /* Hover Effect untuk Toggle Buttons (Pilihan Arus Kas) */
    .fi-fo-toggle-buttons input:not(:checked) + label {
        transition: all 0.2s ease-in-out !important;
    }
    .fi-fo-toggle-buttons input:not(:checked) + label:hover {
        background-color: rgba(var(--primary-500), 0.1) !important;
        border-color: rgba(var(--primary-500), 0.4) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
    }
    /* Pastikan tombol yang terpilih warnanya lebih solid */
    .fi-fo-toggle-buttons input:checked + label {
        box-shadow: 0 4px 10px -2px rgba(var(--primary-500), 0.4) !important;
        transform: scale(1.02) !important;
        transition: all 0.2s ease-in-out !important;
    }

    /* Pastikan background header tidak keluar dari lengkungan (rounded) section */
    .fi-section {
        overflow: hidden !important;
    }

    /* Warna Pink untuk Header Section (Informasi Dasar, Integrasi Portal, dll) */
    .fi-section-header {
        background-color: rgba(var(--primary-500), 0.08) !important;
        border-bottom: 1px solid rgba(var(--primary-500), 0.2) !important;
    }
    .fi-section-header-heading {
        color: rgb(var(--primary-700)) !important;
        font-weight: 700 !important;
    }

    /* List (Border) Kotak Form berwarna pink */
    .fi-input-wrapper, 
    .choices__inner, /* Untuk Select Searchable */
    .fi-select-input {
        box-shadow: inset 0 0 0 1px rgba(var(--primary-500), 0.3) !important;
        transition: all 0.2s ease-in-out !important;
    }
    .fi-input-wrapper:focus-within,
    .choices[data-type*="select-one"].is-open .choices__inner,
    .fi-select-input:focus {
        box-shadow: inset 0 0 0 2px rgba(var(--primary-500), 1) !important;
        background-color: rgba(var(--primary-500), 0.02) !important;
    }
</style>
<?php /**PATH D:\laragon\www\Undangan\resources\views/filament/custom-css.blade.php ENDPATH**/ ?>