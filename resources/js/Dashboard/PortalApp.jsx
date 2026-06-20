import React, { useState, useEffect, Component } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import '../bootstrap';

const MobilePreview = ({ slug, title }) => {
    const containerRef = React.useRef(null);
    const [scale, setScale] = React.useState(1);

    React.useEffect(() => {
        if (!containerRef.current) return;
        setScale(containerRef.current.clientWidth / 414);
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setScale(entry.contentRect.width / 414);
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full flex items-start justify-center overflow-hidden bg-gray-900">
            <div 
                style={{ 
                    width: '414px', 
                    height: '896px', 
                    transform: `translate(-50%, -50%) scale(${scale})`, 
                    transformOrigin: 'center center',
                    position: 'absolute',
                    top: '50%',
                    left: '50%'
                }}
            >
                <iframe 
                    src={`/${slug}?preview=1`} 
                    className="w-full h-full border-0 pointer-events-none"
                    title={title || "Preview"}
                    tabIndex="-1"
                />
            </div>
        </div>
    );
};

const PortalApp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [invitations, setInvitations] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [rsvps, setRsvps] = useState([]);
    const [guestLinks, setGuestLinks] = useState([]);
    const [selectedInvitation, setSelectedInvitation] = useState('');
    const [newGuestName, setNewGuestName] = useState('');
    const [bulkGuestNames, setBulkGuestNames] = useState("");
    const [waGreeting, setWaGreeting] = useState('');
    const [publishStatus, setPublishStatus] = useState('draft');
    const [publishDuration, setPublishDuration] = useState('1_month');
    const [isPublishing, setIsPublishing] = useState(false);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('beranda');
    const [activeFolder, setActiveFolder] = useState(null);
    const [dbFolders, setDbFolders] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
    const [statistics, setStatistics] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDarkMode(true);
        }
    };
    
    const fetchDbFolders = async () => {
        try {
            const res = await axios.get('/admin/invitation-portal/template-folders');
            setDbFolders(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error("Gagal mengambil folder template dari DB", e);
        }
    };

    const handleCreateFolder = async () => {
        const name = await window.promptAsync("Masukkan nama folder baru:");
        if (!name || !name.trim()) return;
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await axios.post('/admin/invitation-portal/template-folders', { name: name.trim() }, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            if (res.data.success) {
                fetchDbFolders();
                alert("Folder berhasil dibuat!");
            }
        } catch (e) {
            console.error(e);
            alert("Gagal membuat folder, mungkin namanya sudah ada.");
        }
    };

    useEffect(() => {
        fetchDbFolders();
        // The existing useEffect for fetching invitations will be updated below
    }, []);

    const handleThumbnailUpload = async (templateId, file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('thumbnail', file);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await axios.post(`/admin/invitation-portal/templates/${templateId}/thumbnail`, formData, {
                headers: { 'X-CSRF-TOKEN': csrfToken, 'Content-Type': 'multipart/form-data' }
            });
            setTemplates(templates.map(t => t.id === templateId ? { ...t, thumbnail_path: res.data.thumbnail_url } : t));
            alert('Thumbnail berhasil diperbarui!');
        } catch (e) {
            console.error(e);
            alert('Gagal mengupload thumbnail');
        }
    };

    const fetchGuestLinks = async (invId) => {
        try {
            const response = await axios.get(`/admin/invitation-portal/${invId}/links`);
            setGuestLinks(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Gagal mengambil data links", error);
        }
    };

    const handleCreateLink = async (e) => {
        e.preventDefault();
        if (!selectedInvitation || !newGuestName) return;
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            await axios.post(`/admin/invitation-portal/${selectedInvitation}/links`, { guest_name: newGuestName }, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            setNewGuestName('');
            fetchGuestLinks(selectedInvitation);
        } catch (error) {
            console.error("Gagal membuat link", error);
            alert("Gagal membuat link.");
        }
    };

    const handleWhatsAppShare = (link) => {
        const invitation = invitations.find(i => i.id === link.invitation_id);
        const url = `${window.location.origin}/${invitation.slug}?to=${encodeURIComponent(link.guest_name)}`;
        
        let message = waGreeting
            ? waGreeting.replace(/\[NAMA_TAMU\]/g, link.guest_name).replace(/\[LINK_UNDANGAN\]/g, url)
            : `Kepada Yth. ${link.guest_name},\n\nKami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBuka undangan di sini:\n${url}\n\nTerima kasih.`;
            
        // Jika user menghapus variabel [LINK_UNDANGAN] dari template, pastikan link tetap terkirim
        if (waGreeting && !waGreeting.includes('[LINK_UNDANGAN]')) {
            message += `\n\nLink Undangan: ${url}`;
        }
        
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleBatchCreateLinks = async (e) => {
        e.preventDefault();
        if (!selectedInvitation || !bulkGuestNames.trim()) return;
        try {
            const names = bulkGuestNames.split(/[\n,]+/).map(n => n.trim()).filter(n => n);
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            await axios.post(`/admin/invitation-portal/${selectedInvitation}/links/batch`, { guest_names: names }, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            setBulkGuestNames('');
            fetchGuestLinks(selectedInvitation);
        } catch (error) {
            console.error("Gagal membuat link massal", error);
            alert("Gagal membuat link massal.");
        }
    };

    const handleSaveGreeting = async () => {
        if (!selectedInvitation) return;
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            await axios.post(`/admin/invitation-portal/${selectedInvitation}/greeting`, { whatsapp_greeting: waGreeting }, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            setInvitations(invitations.map(inv => inv.id == selectedInvitation ? { ...inv, whatsapp_greeting: waGreeting } : inv));
            alert("Template ucapan WA berhasil disimpan.");
        } catch (error) {
            console.error("Gagal menyimpan template WA", error);
            alert("Gagal menyimpan template WA.");
        }
    };

    const handlePublishSubmit = async () => {
        if (!selectedInvitation) return;
        setIsPublishing(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/admin/builder/${selectedInvitation}/publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({
                    status: publishStatus,
                    duration: publishStatus === 'published' ? publishDuration : null
                })
            });
            const data = await response.json();
            if (data.success) {
                setInvitations(invitations.map(inv => inv.id == selectedInvitation ? { ...inv, status: data.status, expires_at: data.expires_at } : inv));
                alert('Pengaturan publikasi berhasil disimpan!');
            } else {
                alert('Gagal menyimpan: ' + data.message);
            }
        } catch (e) {
            console.error(e);
            alert('Terjadi kesalahan jaringan.');
        } finally {
            setIsPublishing(false);
        }
    };

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const response = await axios.get('/admin/invitation-portal/list');
                const invData = Array.isArray(response.data) ? response.data : [];
                setInvitations(invData);
                
                // Cek URL parameter
                const urlParams = new URLSearchParams(window.location.search);
                const tabParam = urlParams.get('tab');
                const idParam = urlParams.get('id');
                
                if (tabParam) {
                    setActiveTab(tabParam);
                }
                
                if (idParam && tabParam === 'distribusi') {
                    setSelectedInvitation(idParam);
                    fetchGuestLinks(idParam);
                    const inv = invData.find(i => i.id == idParam);
                    setWaGreeting(inv?.whatsapp_greeting || `Kepada Yth. [NAMA_TAMU],\n\nKami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBuka undangan di sini:\n[LINK_UNDANGAN]\n\nTerima kasih.`);
                }
            } catch (error) {
                console.error("Gagal mengambil data proyek", error);
            }
        };
        const fetchTemplates = async () => {
            try {
                const response = await axios.get('/admin/invitation-portal/templates');
                setTemplates(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Gagal mengambil data template", error);
            }
        };
        const fetchRsvps = async () => {
            try {
                const response = await axios.get('/admin/invitation-portal/rsvps');
                setRsvps(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Gagal mengambil data rsvp", error);
            }
        };
        const fetchStatistics = async () => {
            try {
                const response = await axios.get('/admin/invitation-portal/statistics');
                setStatistics(response.data);
            } catch (error) {
                console.error("Gagal mengambil statistik", error);
            }
        };
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/admin/invitation-portal/orders');
                setOrders(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Gagal mengambil data pesanan", error);
            }
        };
        fetchInvitations();
        fetchTemplates();
        fetchRsvps();
        fetchStatistics();
        fetchOrders();
    }, []);

    const handleCreateBlank = async () => {
        setIsLoading(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await axios.post('/admin/invitation-portal/create', {}, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            if (response.data?.success && response.data?.redirect_url) {
                window.location.href = response.data.redirect_url;
                return; // Biarkan spinner tetap jalan saat redirect
            } else {
                alert(response.data?.error || response.data?.message || 'Gagal membuat desain baru.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || 'Gagal membuat desain baru.';
            alert(msg);
            setIsLoading(false);
        }
    };

    const handleUseTemplate = async (id) => {
        setIsLoading(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await axios.post(`/admin/invitation-portal/templates/${id}/duplicate`, {}, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            if (response.data?.success && response.data?.redirect_url) {
                window.location.href = response.data.redirect_url;
                return; // Biarkan spinner tetap jalan saat redirect
            } else {
                alert(response.data?.error || response.data?.message || 'Gagal menggunakan template.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || 'Gagal menggunakan template.';
            alert(msg);
            setIsLoading(false);
        }
    };

    const handleOpenProject = (id) => {
        window.location.href = `/admin/builder/${id}`;
    };

    const handleRename = async (e, id, currentTitle) => {
        e.stopPropagation();
        const newTitle = await window.promptAsync("Masukkan nama proyek baru:", currentTitle);
        if (!newTitle || !newTitle.trim() || newTitle === currentTitle) return;
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            await axios.post(`/admin/invitation-portal/${id}/rename`, { title: newTitle.trim() }, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            setInvitations(invitations.map(inv => inv.id === id ? { ...inv, title: newTitle.trim() } : inv));
        } catch (error) {
            console.error(error);
            alert("Gagal mengubah nama proyek.");
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!(await window.confirmAsync("Apakah Anda yakin ingin menghapus proyek ini secara permanen?", "Hapus Proyek?"))) return;
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            await axios.delete(`/admin/invitation-portal/${id}`, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            setInvitations(invitations.filter(inv => inv.id !== id));
        } catch (error) {
            console.error(error);
            alert("Gagal menghapus proyek.");
        }
    };

    const handleUpdateOrderStatus = async (id, newStatus) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            await axios.post(`/admin/invitation-portal/orders/${id}/status`, { status: newStatus }, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
        } catch (error) {
            console.error(error);
            alert("Gagal mengupdate status pesanan.");
        }
    };

    const handleGenerateOrderForm = async (id) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await axios.post(`/admin/invitation-portal/orders/${id}/generate-form`, {}, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            if (res.data.success) {
                setOrders(orders.map(order => order.id === id ? { ...order, form_token: res.data.form_token } : order));
                alert("Form berhasil di-generate.");
            }
        } catch (error) {
            console.error(error);
            alert("Gagal men-generate form.");
        }
    };

    const handleGenerateOrderProject = async (id) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await axios.post(`/admin/invitation-portal/orders/${id}/generate-project`, {}, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            if (res.data.success && res.data.redirect_url) {
                window.location.href = res.data.redirect_url;
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || "Gagal membuat proyek baru dari pesanan ini.";
            alert(msg);
        }
    };

    const handleDeleteOrder = async (id) => {
        if (!(await window.confirmAsync("Apakah Anda yakin ingin menghapus pesanan ini?", "Hapus Pesanan"))) return;
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            await axios.delete(`/admin/invitation-portal/orders/${id}`, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            setOrders(orders.filter(order => order.id !== id));
        } catch (error) {
            console.error(error);
            alert("Gagal menghapus pesanan.");
        }
    };

    const handleRenameOrder = async (id, currentName) => {
        const newName = await window.promptAsync("Masukkan nama klien baru:", currentName);
        if (!newName || !newName.trim() || newName === currentName) return;
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            await axios.post(`/admin/invitation-portal/orders/${id}/rename`, { customer_name: newName.trim() }, {
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });
            setOrders(orders.map(order => order.id === id ? { ...order, customer_name: newName.trim() } : order));
        } catch (error) {
            console.error(error);
            alert("Gagal mengubah nama klien.");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white flex flex-col font-sans">
            {/* Top Navbar */}
            <header className="h-20 flex items-center justify-between px-8 border-b border-[#1e293b] bg-white dark:bg-[#0f172a]/90 backdrop-blur sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Nalaruang.id" className="h-14 md:h-16 w-auto drop-shadow-sm object-contain" />
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={toggleDarkMode} className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                        {isDarkMode ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                        )}
                    </button>
                    <button 
                        onClick={handleCreateBlank}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg flex items-center gap-2"
                    >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Buat Desain
                    </button>
                    <div className="relative">
                        <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-[#1e293b] bg-gradient-to-tr from-orange-400 to-pink-500 cursor-pointer hover:border-gray-400 transition-colors shadow-sm"></div>
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-[#1e293b] rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] py-2 border border-gray-100 dark:border-[#334155] z-[100] animate-fade-in-up">
                                <div className="px-4 py-2 border-b border-gray-100 dark:border-[#334155] mb-1">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Akun Saya</p>
                                </div>
                                <a href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-[#0f172a] hover:text-blue-600 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    Pengaturan Profil
                                </a>
                                <form method="POST" action="/logout" className="m-0">
                                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />
                                    <button type="submit" className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                        Keluar Akun
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Menu */}
                <aside className="w-64 border-r border-[#1e293b] p-6 hidden md:flex flex-col bg-white dark:bg-[#0f172a] z-40">
                    <nav className="flex flex-col gap-2">
                        <button 
                            onClick={() => setActiveTab('beranda')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'beranda' ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-white dark:bg-[#1e293b] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:text-gray-200'}`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                            Beranda
                        </button>
                        <button 
                            onClick={() => setActiveTab('pesanan')}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'pesanan' ? 'bg-orange-600/10 text-orange-500 font-semibold border border-orange-500/20' : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#1e293b] hover:text-gray-800 dark:text-gray-200 border border-transparent'}`}
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63-.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                <span>Pesanan</span>
                            </div>
                            {(() => {
                                const pendingCount = orders.filter(o => ['pending', 'diproses'].includes(String(o.status).toLowerCase())).length;
                                return (
                                    <span className={`ml-auto text-xs font-semibold px-2.5 py-0.5 rounded border ${pendingCount > 0 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800' : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-[#1e293b] dark:text-gray-400 dark:border-gray-700'}`}>
                                        {pendingCount}
                                    </span>
                                );
                            })()}
                        </button>
                        <button 
                            onClick={() => setActiveTab('proyek')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'proyek' ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-white dark:bg-[#1e293b] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:text-gray-200'}`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            Proyek Saya
                        </button>
                        <button 
                            onClick={() => setActiveTab('tamu')}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'tamu' ? 'bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/20' : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#1e293b] hover:text-gray-800 dark:text-gray-200 border border-transparent'}`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            Tamu (RSVP)
                        </button>
                        <button 
                            onClick={() => setActiveTab('distribusi')}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'distribusi' ? 'bg-purple-600/10 text-purple-400 font-semibold border border-purple-500/20' : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#1e293b] hover:text-gray-800 dark:text-gray-200 border border-transparent'}`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                            Distribusi Link
                        </button>
                        <button 
                            onClick={() => setActiveTab('template')}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'template' ? 'bg-yellow-600/10 text-yellow-500 font-semibold border border-yellow-500/20' : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#1e293b] hover:text-gray-800 dark:text-gray-200 border border-transparent'}`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            Kelola Template
                        </button>
                        <button 
                            onClick={() => setActiveTab('statistik')}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'statistik' ? 'bg-emerald-600/10 text-emerald-500 font-semibold border border-emerald-500/20' : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-[#1e293b] hover:text-gray-800 dark:text-gray-200 border border-transparent'}`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                            Statistik Analitik
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-gray-50 dark:bg-[#0b1120]">

                    {activeTab === 'statistik' && statistics && (
                        <div className="max-w-6xl mx-auto animate-fade-in-up">
                            <div className="mb-8">
                                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Statistik Analitik</h2>
                                <p className="text-gray-500 dark:text-gray-400">Pantau performa dan kunjungan undangan Anda.</p>
                            </div>

                            {/* Score Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-gray-100 dark:border-[#1e293b] shadow-sm flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Tamu Disebar</p>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">{statistics.overview.totalGuests}</h3>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-gray-100 dark:border-[#1e293b] shadow-sm flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Kunjungan</p>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">{statistics.overview.totalVisitors} <span className="text-xs text-emerald-500 ml-1 font-bold">({statistics.overview.engagementRate}%)</span></h3>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-gray-100 dark:border-[#1e293b] shadow-sm flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total RSVP</p>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">{statistics.overview.totalRsvp}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 mt-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    Performa Penjualan & Pesanan
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white dark:bg-[#0f172a] rounded-xl p-5 border border-indigo-100 dark:border-indigo-900/30 shadow-sm flex flex-col justify-center">
                                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-500 uppercase tracking-wider mb-1">Total Pesanan</p>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{orders.length}</h3>
                                </div>
                                <div className="bg-white dark:bg-[#0f172a] rounded-xl p-5 border border-yellow-100 dark:border-yellow-900/30 shadow-sm flex flex-col justify-center">
                                    <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider mb-1">Pending & Proses</p>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{orders.filter(o => ['pending', 'diproses'].includes(String(o.status).toLowerCase())).length}</h3>
                                </div>
                                <div className="bg-white dark:bg-[#0f172a] rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/30 shadow-sm flex flex-col justify-center">
                                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider mb-1">Pesanan Selesai</p>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{orders.filter(o => ['selesai', 'completed'].includes(String(o.status).toLowerCase())).length}</h3>
                                </div>
                                <div className="bg-white dark:bg-[#0f172a] rounded-xl p-5 border border-green-100 dark:border-green-900/30 shadow-sm flex flex-col justify-center">
                                    <p className="text-xs font-semibold text-green-600 dark:text-green-500 uppercase tracking-wider mb-1">Total Pendapatan</p>
                                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">Rp {new Intl.NumberFormat('id-ID').format(orders.filter(o => ['selesai', 'completed'].includes(String(o.status).toLowerCase())).reduce((acc, order) => acc + (parseFloat(order.total_price) || 0), 0))}</h3>
                                </div>
                            </div>

                            <div className="mb-6 mt-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                    Statistik Kunjungan
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                                {/* Line Chart */}
                                <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-[#1e293b] shadow-sm">
                                    <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                                        Tren Kunjungan (30 Hari Terakhir)
                                    </h3>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={statistics.chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} />
                                                <XAxis dataKey="name" tick={{fill: isDarkMode ? '#64748b' : '#94a3b8', fontSize: 12}} tickLine={false} axisLine={false} />
                                                <YAxis tick={{fill: isDarkMode ? '#64748b' : '#94a3b8', fontSize: 12}} tickLine={false} axisLine={false} />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                                />
                                                <Line type="monotone" dataKey="visits" name="Kunjungan" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Pie Chart */}
                                <div className="bg-white dark:bg-[#0f172a] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-[#1e293b] shadow-sm flex flex-col items-center">
                                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white w-full flex items-center gap-2">
                                        <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                                        Rasio RSVP
                                    </h3>
                                    <div className="h-[250px] w-full mt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statistics.rsvpPie}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {statistics.rsvpPie.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex items-center justify-center gap-6 mt-2 w-full">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Hadir</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                                            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Tidak Hadir</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Top Invitations Table */}
                            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-100 dark:border-[#1e293b] shadow-sm overflow-hidden mb-12">
                                <div className="p-6 border-b border-gray-100 dark:border-[#1e293b]">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                        Top 10 Undangan Terpopuler
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-[#1e293b]/50">
                                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Thumbnail</th>
                                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Judul / Klien</th>
                                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Kunjungan</th>
                                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">RSVP</th>
                                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Tamu Disebar</th>
                                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-[#1e293b]">
                                            {statistics.topInvitations.map((inv) => (
                                                <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                    <td className="py-3 px-6">
                                                        {inv.thumbnail ? (
                                                            <img src={inv.thumbnail} alt={inv.title} className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-gray-200 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                                                                <div style={{ width: '414px', height: '414px', transform: 'scale(0.096)', transformOrigin: 'top left' }}>
                                                                    <iframe src={`/${inv.slug}?preview=1`} className="w-full h-full border-0 pointer-events-none" tabIndex="-1" loading="lazy" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-6 font-bold text-gray-900 dark:text-gray-100">{inv.title}</td>
                                                    <td className="py-3 px-6 text-center">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                            {inv.visitors_count}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-6 text-center">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-bold">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                            {inv.rsvps_count}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-6 text-center">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                                            {inv.guests_count}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-6 text-right">
                                                        <button onClick={() => window.open(`/${inv.slug}`, '_blank')} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'pesanan' && (
                        <div className="max-w-6xl mx-auto animate-fade-in-up">
                            <div className="mb-8">
                                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Manajemen Pesanan</h2>
                                <p className="text-gray-500 dark:text-gray-400">Kelola pesanan dari Landing Page, generate form aset, dan buat project.</p>
                            </div>

                            {/* Statistik Pesanan */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                                <div className="bg-white dark:bg-[#0f172a] rounded-xl p-4 border border-gray-100 dark:border-[#1e293b] shadow-sm flex flex-col justify-center">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Semua</p>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{orders.length}</h3>
                                </div>
                                <div className="bg-white dark:bg-[#0f172a] rounded-xl p-4 border border-yellow-100 dark:border-yellow-900/30 shadow-sm flex flex-col justify-center">
                                    <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Pending
                                    </p>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{orders.filter(o => String(o.status).toLowerCase() === 'pending').length}</h3>
                                </div>
                                <div className="bg-white dark:bg-[#0f172a] rounded-xl p-4 border border-blue-100 dark:border-blue-900/30 shadow-sm flex flex-col justify-center">
                                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Diproses
                                    </p>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{orders.filter(o => String(o.status).toLowerCase() === 'diproses').length}</h3>
                                </div>
                                <div className="bg-white dark:bg-[#0f172a] rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30 shadow-sm flex flex-col justify-center">
                                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Selesai
                                    </p>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{orders.filter(o => ['selesai', 'completed'].includes(String(o.status).toLowerCase())).length}</h3>
                                </div>
                                <div className="bg-white dark:bg-[#0f172a] rounded-xl p-4 border border-red-100 dark:border-red-900/30 shadow-sm flex flex-col justify-center">
                                    <p className="text-xs font-semibold text-red-600 dark:text-red-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-red-500"></span> Dibatalkan
                                    </p>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{orders.filter(o => String(o.status).toLowerCase() === 'dibatalkan').length}</h3>
                                </div>
                            </div>
                            
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                {orders.map(order => (
                                    <div key={order.id} className="bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-100 dark:border-[#1e293b] shadow-sm overflow-hidden flex flex-col relative group">
                                        {/* Header / Template Thumbnail */}
                                        <div 
                                            className="h-28 bg-gray-100 dark:bg-[#1e293b] relative overflow-hidden cursor-pointer group/thumb"
                                            onClick={() => setSelectedOrder(order)}
                                            title="Klik untuk melihat detail pesanan"
                                        >
                                            <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/20 z-10 transition-colors flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            </div>
                                            {order.template && order.template.image ? (
                                                <img src={`${window.ASSET_URL || '/storage/'}${order.template.image}`} className="w-full h-full object-cover opacity-80" alt={order.template.name} />
                                            ) : order.template && order.template.preview_url ? (
                                                <div className="w-full h-full relative bg-gray-900 pointer-events-none">
                                                    <MobilePreview 
                                                        slug={(() => {
                                                            try {
                                                                const p = new URL(order.template.preview_url).pathname;
                                                                return p.startsWith('/') ? p.substring(1) : p;
                                                            } catch(e) {
                                                                return order.template.preview_url.startsWith('/') ? order.template.preview_url.substring(1) : order.template.preview_url;
                                                            }
                                                        })()} 
                                                        title={order.template.name} 
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                </div>
                                            )}
                                            <div className={`absolute top-3 right-3 px-2.5 py-1 backdrop-blur text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm z-10 ${
                                                String(order.status).toLowerCase() === 'pending' ? 'bg-yellow-500/90 text-white' :
                                                String(order.status).toLowerCase() === 'diproses' ? 'bg-blue-500/90 text-white' :
                                                String(order.status).toLowerCase() === 'revisi' ? 'bg-orange-500/90 text-white' :
                                                ['selesai', 'completed'].includes(String(order.status).toLowerCase()) ? 'bg-emerald-500/90 text-white' :
                                                String(order.status).toLowerCase() === 'dibatalkan' ? 'bg-red-500/90 text-white' :
                                                'bg-gray-500/90 text-white'
                                            }`}>
                                                {String(order.status).toLowerCase() === 'completed' ? 'Selesai' : order.status}
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteOrder(order.id)} 
                                                className="absolute top-3 left-3 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
                                                title="Hapus Pesanan"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>

                                        {/* Body */}
                                        <div className="p-4 flex-1 flex flex-col">
                                            <div className="flex items-start justify-between mb-1">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                                                    {order.customer_name}
                                                </h3>
                                                <button 
                                                    onClick={() => handleRenameOrder(order.id, order.customer_name)}
                                                    className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                                                    title="Ubah Nama"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                                {order.template?.name || 'Template Dihapus'}
                                            </p>

                                            {/* Status Changer */}
                                            <div className="mb-4">
                                                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Status Pengerjaan</label>
                                                <div className="relative">
                                                    <select 
                                                        value={String(order.status).toLowerCase() === 'completed' ? 'selesai' : String(order.status).toLowerCase()}
                                                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                        className={`w-full text-sm font-semibold rounded-xl border-gray-200 dark:border-gray-700 p-2.5 pr-8 appearance-none focus:ring-2 focus:ring-offset-1 focus:outline-none transition shadow-sm ${
                                                            String(order.status).toLowerCase() === 'pending' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 focus:ring-yellow-500' :
                                                            String(order.status).toLowerCase() === 'diproses' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 focus:ring-blue-500' :
                                                            String(order.status).toLowerCase() === 'revisi' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 focus:ring-orange-500' :
                                                            ['selesai', 'completed'].includes(String(order.status).toLowerCase()) ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 focus:ring-emerald-500' :
                                                            String(order.status).toLowerCase() === 'dibatalkan' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 focus:ring-red-500' :
                                                            'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-gray-500'
                                                        }`}
                                                    >
                                                        <option value="pending" className="bg-white text-gray-900 font-medium">Pending</option>
                                                        <option value="diproses" className="bg-white text-gray-900 font-medium">Diproses</option>
                                                        <option value="revisi" className="bg-white text-gray-900 font-medium">Revisi</option>
                                                        <option value="selesai" className="bg-white text-gray-900 font-medium">Selesai</option>
                                                        <option value="dibatalkan" className="bg-white text-gray-900 font-medium">Dibatalkan</option>
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                                        <svg className={`w-4 h-4 ${
                                                            String(order.status).toLowerCase() === 'pending' ? 'text-yellow-500' :
                                                            String(order.status).toLowerCase() === 'diproses' ? 'text-blue-500' :
                                                            String(order.status).toLowerCase() === 'revisi' ? 'text-orange-500' :
                                                            ['selesai', 'completed'].includes(String(order.status).toLowerCase()) ? 'text-emerald-500' :
                                                            String(order.status).toLowerCase() === 'dibatalkan' ? 'text-red-500' :
                                                            'text-gray-500'
                                                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-auto space-y-2">
                                                {/* Form Actions */}
                                                {!order.form_token ? (
                                                    <button 
                                                        onClick={() => handleGenerateOrderForm(order.id)}
                                                        className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg text-sm font-bold shadow-md transition transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                        Buat Form Klien
                                                    </button>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => {
                                                                const url = `${window.location.origin}/client/form/${order.form_token}`;
                                                                navigator.clipboard.writeText(url);
                                                                alert("Link form berhasil disalin!");
                                                            }}
                                                            className="flex-1 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition flex items-center justify-center gap-1"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                                            Salin Link Form
                                                        </button>
                                                        <button 
                                                            onClick={() => window.open(`/client/form/${order.form_token}`, '_blank')}
                                                            className="w-10 flex-shrink-0 flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                                            title="Buka Form Klien"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Generate Project Action */}
                                                <button 
                                                    onClick={() => handleGenerateOrderProject(order.id)}
                                                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition flex justify-center items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                                    Buat Projek
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {orders.length === 0 && (
                                <div className="text-center py-20 bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-100 dark:border-[#1e293b]">
                                    <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Belum ada pesanan masuk</h3>
                                    <p className="text-gray-500">Pesanan dari klien akan otomatis muncul di sini.</p>
                                </div>
                            )}

                            {/* Order Detail Modal */}
                            {selectedOrder && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
                                    <div className="bg-white dark:bg-[#0f172a] w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up border border-gray-200 dark:border-gray-800">
                                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detail Pesanan</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID Pesanan: #{selectedOrder.id}</p>
                                            </div>
                                            <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </div>
                                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Nama Klien</p>
                                                    <p className="text-base font-bold text-gray-900 dark:text-white">{selectedOrder.customer_name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Nomor WhatsApp</p>
                                                    <p className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                        {selectedOrder.customer_phone || '-'}
                                                        {selectedOrder.customer_phone && (
                                                            <a href={`https://wa.me/${selectedOrder.customer_phone.replace(/^0/, '62').replace(/\D/g, '')}`} target="_blank" className="text-emerald-500 hover:text-emerald-600" title="Hubungi via WhatsApp">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                                            </a>
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Tanggal Acara</p>
                                                    <p className="text-base font-medium text-gray-900 dark:text-white">
                                                        {selectedOrder.event_date ? new Date(selectedOrder.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Pendapatan</p>
                                                    <p className="text-base font-bold text-green-600 dark:text-green-400">Rp {new Intl.NumberFormat('id-ID').format(selectedOrder.total_price || 0)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Template Terpilih</p>
                                                    <p className="text-base font-medium text-gray-900 dark:text-white">{selectedOrder.template?.name || 'Tidak ada/dihapus'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Estimasi Tamu</p>
                                                    <p className="text-base font-medium text-gray-900 dark:text-white">{selectedOrder.guest_list || 0} Orang</p>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                    Catatan / Request Khusus
                                                </h4>
                                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300">
                                                    {selectedOrder.custom_requests || <span className="italic text-gray-400">Tidak ada catatan khusus dari klien.</span>}
                                                </div>
                                            </div>

                                            {selectedOrder.details && Object.keys(selectedOrder.details).length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                                                        Data Tambahan (Form Klien)
                                                    </h4>
                                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                                                        <table className="w-full text-sm text-left">
                                                            <tbody>
                                                                {Object.entries(selectedOrder.details).map(([key, value], idx) => (
                                                                    <tr key={key} className={idx !== Object.keys(selectedOrder.details).length - 1 ? 'border-b border-gray-100 dark:border-gray-700/50' : ''}>
                                                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 w-1/3 bg-gray-50 dark:bg-gray-800/30 capitalize">{key.replace(/_/g, ' ')}</td>
                                                                        <td className="py-3 px-4 text-gray-900 dark:text-gray-200">
                                                                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0f172a] flex justify-end">
                                            <button onClick={() => setSelectedOrder(null)} className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-bold transition">Tutup</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {activeTab === 'beranda' && (
                        <>
                            {/* Hero Banner */}
                            <div className="w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 rounded-2xl p-6 md:p-8 mb-8 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
                                <div className="relative z-10 flex-1">
                                    <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight">Mulai mendesain mahakarya Anda.</h1>
                                    <p className="text-blue-100 text-sm md:text-base max-w-xl opacity-90">Buat undangan digital interaktif dan animasi memukau hanya dalam beberapa klik.</p>
                                </div>
                                <div className="relative z-10 w-full md:w-96 shrink-0">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center px-4 py-2.5 shadow-inner hover:bg-white/15 transition-colors focus-within:bg-white/15 focus-within:border-white/40">
                                        <svg className="w-5 h-5 text-white/70 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        <input type="text" placeholder="Cari template (misal: Pernikahan Elegan)" className="bg-transparent border-none text-white placeholder-white/50 w-full focus:outline-none focus:ring-0 text-sm" />
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                Mulai Baru
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
                                {/* Blank Canvas Card */}
                                <div 
                                    onClick={isLoading ? undefined : handleCreateBlank}
                                    className={`group relative bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.5)] hover:-translate-y-2 hover:border-blue-500 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <div className="h-48 bg-white dark:bg-[#0f172a] flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                                        <div className="absolute w-40 h-40 bg-blue-500/20 blur-3xl rounded-full group-hover:bg-blue-500/30 transition-colors"></div>
                                        {isLoading ? (
                                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform duration-300 relative z-10">
                                                <svg className="w-8 h-8 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 bg-white dark:bg-[#1e293b] relative z-10 border-t border-gray-200 dark:border-[#334155]">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-400 transition-colors">Kanvas Kosong</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Buat desain dari awal</p>
                                    </div>
                                </div>

                                {/* Dynamic Templates */}
                                {templates.map(template => (
                                    <div 
                                        key={template.id}
                                        onClick={isLoading ? undefined : () => handleUseTemplate(template.id)}
                                        className={`group bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.4)] hover:-translate-y-2 hover:border-purple-500 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                                    >
                                        <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative overflow-hidden group-hover:border-purple-500/50">
                                            {template.thumbnail_path ? (
                                                <img src={template.thumbnail_path.startsWith('http') ? template.thumbnail_path : `/${template.thumbnail_path}`} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <MobilePreview slug={template.slug} title={template.title} />
                                            )}
                                            <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur rounded text-xs font-bold text-yellow-400 border border-yellow-500/30 z-20 shadow-lg">
                                                {template.price > 0 ? 'Rp ' + Number(template.price).toLocaleString('id-ID') : 'Gratis'}
                                            </div>
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 dark:group-hover:bg-black/40 transition-colors z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-xl rounded-lg px-4 py-2 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
                                                    <span className="text-gray-900 dark:text-white font-bold tracking-widest text-sm flex items-center gap-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                                        Gunakan Template
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-5 relative">
                                            <div className="absolute -top-4 right-4 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-[#334155] text-xs font-bold text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                                <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                {template.total_uses} digunakan
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-400 transition-colors truncate">{template.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{template.category || 'Uncategorized'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Proyek Saya Section */}
                    {(activeTab === 'proyek' || activeTab === 'beranda') && (
                        <>
                            <div className="flex items-center justify-between mb-6 mt-4">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Desain Terakhir</h2>
                                {activeTab === 'beranda' && (
                                    <button onClick={() => setActiveTab('proyek')} className="text-blue-400 hover:text-blue-300 text-sm font-medium">Lihat Semua</button>
                                )}
                            </div>

                            {(!invitations || invitations.length === 0) ? (
                                <div className="text-center py-24 bg-gradient-to-b from-white to-blue-50 dark:from-[#1e293b] dark:to-[#0f172a] rounded-3xl border border-blue-100 dark:border-blue-900/30 shadow-inner relative overflow-hidden mt-4">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSg1OSwgMTMwLCAyNDYsIDAuMSkiLz4KPC9zdmc+')] opacity-50 pointer-events-none"></div>
                                    <div className="w-24 h-24 bg-white dark:bg-[#1e293b] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10">
                                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white relative z-10">Karya Anda Dimulai di Sini</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-md mx-auto relative z-10 mb-8 leading-relaxed">
                                        Belum ada undangan atau desain yang Anda buat. Pilih template di atas atau mulai dari kanvas kosong untuk menciptakan mahakarya Anda.
                                    </p>
                                    <button onClick={handleCreateBlank} className="relative z-10 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                        Mulai Kanvas Kosong
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {invitations.map((inv) => (
                                        <div 
                                            key={inv.id}
                                            onClick={() => handleOpenProject(inv.id)}
                                            className="group bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_-10px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:border-gray-400"
                                        >
                                            <div className="h-40 bg-gray-100 dark:bg-gray-800 p-0 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                                                <div className={`absolute top-3 right-3 px-2 py-1 backdrop-blur rounded text-[10px] font-bold text-white border uppercase z-20 shadow ${inv.status === 'published' ? 'bg-emerald-500/80 border-emerald-400' : 'bg-gray-700/80 border-gray-500'}`}>
                                                    {inv.status}
                                                </div>
                                                {inv.thumbnail_path ? (
                                                    <img src={inv.thumbnail_path.startsWith('http') ? inv.thumbnail_path : `/${inv.thumbnail_path}`} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <MobilePreview slug={inv.slug} title={inv.title} />
                                                )}
                                            </div>
                                            <div className="p-4 bg-white dark:bg-[#1e293b] border-t border-gray-200 dark:border-[#334155] relative flex justify-between items-center">
                                                <div className="flex-1 min-w-0 mr-2">
                                                    <h3 className="text-md font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-400 transition-colors">{inv.title}</h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Diperbarui: {new Date(inv.updated_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}</p>
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    <button onClick={(e) => handleRename(e, inv.id, inv.title)} className="p-1.5 text-gray-400 hover:text-blue-500 bg-gray-100 dark:bg-gray-800 rounded transition" title="Ubah Nama">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                    </button>
                                                    <button onClick={(e) => handleDelete(e, inv.id)} className="p-1.5 text-gray-400 hover:text-red-500 bg-gray-100 dark:bg-gray-800 rounded transition" title="Hapus">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'tamu' && (
                        <>
                            <div className="flex items-center justify-between mb-6 mt-4">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Daftar Kehadiran (RSVP)</h2>
                            </div>
                            
                            <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-2xl overflow-hidden shadow-lg">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-[#334155]">
                                            <th className="py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Nama Tamu</th>
                                            <th className="py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Status</th>
                                            <th className="py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Pesan/Doa</th>
                                            <th className="py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Undangan</th>
                                            <th className="py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Waktu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rsvps.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-gray-500">Belum ada data RSVP yang masuk.</td>
                                            </tr>
                                        ) : (
                                            rsvps.map(rsvp => (
                                                <tr key={rsvp.id} className="border-b border-gray-200 dark:border-[#334155]/50 hover:bg-gray-200 dark:bg-[#334155]/20 transition-colors">
                                                    <td className="py-4 px-6 text-gray-800 dark:text-gray-200 font-medium">{rsvp.name}</td>
                                                    <td className="py-4 px-6">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${rsvp.status === 'Hadir' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                            {rsvp.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400 text-sm italic">"{rsvp.message || '-'}"</td>
                                                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400 text-sm truncate max-w-[150px]">{rsvp.invitation?.title || 'Undangan'}</td>
                                                    <td className="py-4 px-6 text-gray-500 text-sm">{new Date(rsvp.created_at).toLocaleString('id-ID')}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'distribusi' && (
                        <>
                            <div className="flex items-center justify-between mb-6 mt-4">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Distribusi Link Undangan</h2>
                            </div>
                            
                            <div className="bg-white dark:bg-[#1e293b] p-6 border border-gray-200 dark:border-[#334155] rounded-2xl shadow-lg mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pilih Undangan & Buat Link</h3>
                                <div className="flex gap-4">
                                    <select 
                                        value={selectedInvitation} 
                                        onChange={(e) => {
                                            const invId = e.target.value;
                                            setSelectedInvitation(invId);
                                            if (invId) {
                                                fetchGuestLinks(invId);
                                                const inv = invitations.find(i => i.id == invId);
                                                setWaGreeting(inv?.whatsapp_greeting || `Kepada Yth. [NAMA_TAMU],\n\nKami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBuka undangan di sini:\n[LINK_UNDANGAN]\n\nTerima kasih.`);
                                                setPublishStatus(inv?.status || 'draft');
                                            } else {
                                                setWaGreeting('');
                                                setPublishStatus('draft');
                                            }
                                        }}
                                        className="flex-1 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-[#334155] rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-purple-500"
                                    >
                                        <option value="">-- Pilih Undangan --</option>
                                        {invitations.map(inv => (
                                            <option key={inv.id} value={inv.id}>{inv.title}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedInvitation && (() => {
                                    const currentInv = invitations.find(i => i.id == selectedInvitation);
                                    return (
                                    <>
                                        <div className="mt-8 mb-6 p-6 bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-200 dark:border-[#334155]">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-[#1e293b] pb-4">1. Status Undangan & Akses Portal Klien</h3>
                                            
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                                        Status Publikasi
                                                    </label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {/* Draft Card */}
                                                        <label className={`relative flex flex-col p-4 cursor-pointer rounded-2xl border-2 transition-all duration-300 ${publishStatus === 'draft' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1e293b] hover:border-indigo-200 dark:hover:border-indigo-800'}`}>
                                                            <input type="radio" name="publish_status" value="draft" checked={publishStatus === 'draft'} onChange={() => setPublishStatus('draft')} className="sr-only" />
                                                            <div className="flex justify-between items-center mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`p-2 rounded-lg ${publishStatus === 'draft' ? 'bg-indigo-100 dark:bg-indigo-800/50 text-indigo-600 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                                                    </div>
                                                                    <span className={`font-bold ${publishStatus === 'draft' ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-300'}`}>Private Draft</span>
                                                                </div>
                                                                {publishStatus === 'draft' && <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>}
                                                            </div>
                                                            <p className={`text-xs mt-1 ${publishStatus === 'draft' ? 'text-indigo-700/70 dark:text-indigo-300/70' : 'text-gray-500 dark:text-gray-400'}`}>Undangan ditutup. Portal klien dinonaktifkan sepenuhnya.</p>
                                                        </label>

                                                        {/* Published Card */}
                                                        <label className={`relative flex flex-col p-4 cursor-pointer rounded-2xl border-2 transition-all duration-300 ${publishStatus === 'published' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1e293b] hover:border-emerald-200 dark:hover:border-emerald-800'}`}>
                                                            <input type="radio" name="publish_status" value="published" checked={publishStatus === 'published'} onChange={() => setPublishStatus('published')} className="sr-only" />
                                                            <div className="flex justify-between items-center mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`p-2 rounded-lg ${publishStatus === 'published' ? 'bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
                                                                    </div>
                                                                    <span className={`font-bold ${publishStatus === 'published' ? 'text-emerald-900 dark:text-emerald-100' : 'text-gray-700 dark:text-gray-300'}`}>Go Public</span>
                                                                </div>
                                                                {publishStatus === 'published' && <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>}
                                                            </div>
                                                            <p className={`text-xs mt-1 ${publishStatus === 'published' ? 'text-emerald-700/70 dark:text-emerald-300/70' : 'text-gray-500 dark:text-gray-400'}`}>Undangan bisa diakses. Portal klien aktif untuk dishare.</p>
                                                        </label>
                                                    </div>
                                                </div>

                                                {publishStatus === 'published' && (
                                                    <div className="animate-fade-in-up">
                                                        <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                            Masa Aktif Link
                                                        </label>
                                                        <div className="relative">
                                                            <select 
                                                                value={publishDuration}
                                                                onChange={(e) => setPublishDuration(e.target.value)}
                                                                className="w-full appearance-none bg-white dark:bg-[#1e293b] border-2 border-gray-200 dark:border-[#334155] rounded-xl pl-4 pr-10 py-3.5 text-gray-900 dark:text-white font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer shadow-sm"
                                                            >
                                                                <option value="2_weeks">2 Minggu</option>
                                                                <option value="1_month">1 Bulan</option>
                                                                <option value="1_year">1 Tahun</option>
                                                                <option value="forever">Selamanya (Tidak Kedaluwarsa)</option>
                                                            </select>
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                            </div>
                                                        </div>
                                                        {currentInv?.expires_at && (
                                                            <div className="mt-3 flex items-start gap-2 bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400 p-3 rounded-lg border border-orange-100 dark:border-orange-800/30">
                                                                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                                <p className="text-xs font-medium leading-relaxed">
                                                                    Link undangan ini dijadwalkan kedaluwarsa pada: <strong className="font-bold">{new Date(currentInv.expires_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#1e293b] flex items-center justify-between">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm hidden md:block">Pastikan untuk menyimpan perubahan agar status publikasi klien ter-update secara realtime.</p>
                                                <button 
                                                    onClick={handlePublishSubmit}
                                                    disabled={isPublishing}
                                                    className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                                >
                                                    {isPublishing ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                            Menyimpan...
                                                        </>
                                                    ) : 'Simpan Pengaturan'}
                                                </button>
                                            </div>

                                            {currentInv?.status === 'published' && (
                                                <div className="mt-6 p-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl relative overflow-hidden group">
                                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                                                    <h4 className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2 relative z-10">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                                        Tautan Portal Klien (Aktif)
                                                    </h4>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 relative z-10 leading-relaxed">Berikan link di bawah ini kepada pengantin agar mereka dapat <b>menyebar undangan WA sendiri</b> tanpa perlu mengakses dasbor admin Anda.</p>
                                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
                                                        <div className="flex-1 bg-white/50 dark:bg-black/20 border border-emerald-500/20 rounded-lg px-4 py-2.5 font-mono text-sm text-emerald-700 dark:text-emerald-300 truncate">
                                                            {window.location.origin}/client/{currentInv.slug}
                                                        </div>
                                                        <a href={`/client/${currentInv.slug}`} target="_blank" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-lg hover:shadow-emerald-500/30 transition-all text-center whitespace-nowrap">
                                                            Buka Portal Klien
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 mt-8">2. Pengaturan Template WA & Buat Link Tamu</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-gray-200 dark:border-[#334155]">
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Buat Link Satuan</h4>
                                            <form onSubmit={handleCreateLink} className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="Nama tamu..." 
                                                    value={newGuestName}
                                                    onChange={e => setNewGuestName(e.target.value)}
                                                    className="flex-1 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-purple-500 text-sm"
                                                />
                                                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-gray-900 dark:text-white transition-colors text-sm">
                                                    Buat
                                                </button>
                                            </form>
                                            
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 mt-6">Buat Link Massal</h4>
                                            <form onSubmit={handleBatchCreateLinks} className="flex flex-col gap-2">
                                                <textarea 
                                                    placeholder="Paste daftar nama tamu di sini (pisahkan dengan koma atau baris baru)..." 
                                                    value={bulkGuestNames}
                                                    onChange={e => setBulkGuestNames(e.target.value)}
                                                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-purple-500 text-sm min-h-[100px] resize-y"
                                                />
                                                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-gray-900 dark:text-white transition-colors text-sm w-full">
                                                    Buat Sekaligus
                                                </button>
                                            </form>
                                        </div>

                                        <div className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-gray-200 dark:border-[#334155]">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Template Ucapan WA</h4>
                                                <button onClick={handleSaveGreeting} className="px-3 py-1 bg-green-600/20 text-green-400 hover:bg-green-600/30 rounded text-xs font-bold transition-colors">
                                                    Simpan Template
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2">Gunakan variabel <code className="text-purple-400">[NAMA_TAMU]</code> dan <code className="text-purple-400">[LINK_UNDANGAN]</code> yang akan otomatis diganti saat dikirim.</p>
                                            <textarea 
                                                value={waGreeting}
                                                onChange={e => setWaGreeting(e.target.value)}
                                                className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-lg px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-green-500 text-sm min-h-[180px] resize-y"
                                            />
                                        </div>
                                        </div>
                                    </>
                                    );
                                })()}
                            </div>

                            {selectedInvitation && (
                                <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-2xl overflow-hidden shadow-lg">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-[#334155]">
                                                <th className="py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">Nama Tamu</th>
                                                <th className="py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">URL Khusus</th>
                                                <th className="py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {guestLinks.length === 0 ? (
                                                <tr>
                                                    <td colSpan="3" className="py-8 text-center text-gray-500">Belum ada link yang dibuat.</td>
                                                </tr>
                                            ) : (
                                                guestLinks.map(link => {
                                                    const invitation = invitations.find(i => i.id === link.invitation_id);
                                                    const url = `${window.location.origin}/${invitation?.slug}?to=${encodeURIComponent(link.guest_name)}`;
                                                    return (
                                                        <tr key={link.id} className="border-b border-gray-200 dark:border-[#334155]/50 hover:bg-gray-200 dark:bg-[#334155]/20 transition-colors">
                                                            <td className="py-4 px-6 text-gray-800 dark:text-gray-200 font-medium">{link.guest_name}</td>
                                                            <td className="py-4 px-6 text-gray-500 dark:text-gray-400 text-sm truncate max-w-[250px]">{url}</td>
                                                            <td className="py-4 px-6 text-right">
                                                                <button 
                                                                    onClick={() => handleWhatsAppShare(link)}
                                                                    className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ml-auto transition-colors"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                                                    Bagikan WA
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                    {activeTab === 'template' && (() => {
                        const templateFolders = templates.reduce((acc, t) => {
                            const cat = t.category || 'Belum Dikategorikan';
                            if (!acc[cat]) acc[cat] = [];
                            acc[cat].push(t);
                            return acc;
                        }, {});

                        // Ensure all explicitly created DB folders are present even if empty
                        dbFolders.forEach(dbf => {
                            if (!templateFolders[dbf.name]) {
                                templateFolders[dbf.name] = [];
                            }
                        });

                        return (
                            <>
                                <div className="flex items-center justify-between mb-6 mt-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kelola Template</h2>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manajemen template desain Anda berdasarkan kategori/folder.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {!activeFolder && (
                                            <button 
                                                onClick={handleCreateFolder}
                                                className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 border border-indigo-500/30"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
                                                Buat Folder
                                            </button>
                                        )}
                                        {activeFolder && (
                                            <button 
                                                onClick={() => setActiveFolder(null)}
                                                className="px-4 py-2 bg-gray-200 dark:bg-[#334155] hover:bg-gray-300 dark:hover:bg-[#475569] text-gray-900 dark:text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                                Kembali ke Folder
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                {!activeFolder ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                        {Object.entries(templateFolders).map(([folderName, items]) => (
                                            <div 
                                                key={folderName}
                                                onClick={() => setActiveFolder(folderName)}
                                                className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-2xl p-6 hover:border-indigo-500/50 hover:bg-white dark:bg-[#1e293b]/80 cursor-pointer transition-all group flex flex-col items-center justify-center text-center shadow-lg"
                                            >
                                                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                                </div>
                                                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-1">{folderName}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} Template</p>
                                            </div>
                                        ))}
                                        {Object.keys(templateFolders).length === 0 && (
                                            <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 dark:border-[#334155] rounded-2xl">
                                                <p className="text-gray-500 dark:text-gray-400 mb-4">Belum ada folder atau template.</p>
                                                <button 
                                                    onClick={handleCreateFolder}
                                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors"
                                                >
                                                    Buat Folder Pertama
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-[#334155]">
                                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Folder: {activeFolder}</h3>
                                            <span className="px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-[#334155] text-xs font-semibold text-gray-700 dark:text-gray-300 ml-2">
                                                {templateFolders[activeFolder]?.length || 0} Item
                                            </span>
                                        </div>

                                        {templateFolders[activeFolder]?.length === 0 ? (
                                            <div className="py-12 text-center border-2 border-dashed border-gray-200 dark:border-[#334155] rounded-2xl">
                                                <p className="text-gray-500 dark:text-gray-400">Folder ini masih kosong.</p>
                                                <p className="text-xs text-gray-500 mt-2">Buka proyek Anda di Builder dan klik "Simpan sbg Template" ke folder "{activeFolder}".</p>
                                            </div>
                                        ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {templateFolders[activeFolder]?.map(item => (
                                                <div key={item.id} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-2xl overflow-hidden hover:border-[#475569] transition-all shadow-lg flex flex-col relative group">
                                                    
                                                    {/* Upload Thumbnail Button (Top Right) */}
                                                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <label className="cursor-pointer bg-black/60 hover:bg-black/80 backdrop-blur text-gray-900 dark:text-white p-2 rounded-lg flex items-center justify-center transition" title="Ubah Thumbnail">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                            <input 
                                                                type="file" 
                                                                className="hidden" 
                                                                accept="image/*"
                                                                onChange={(e) => handleThumbnailUpload(item.id, e.target.files[0])}
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className="h-48 w-full bg-white dark:bg-[#0f172a] relative border-b border-gray-200 dark:border-[#334155]">
                                                        {item.thumbnail_path ? (
                                                            <img src={`/${item.thumbnail_path}`} alt="Thumbnail" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <MobilePreview slug={item.slug} title={item.title} />
                                                        )}
                                                    </div>

                                                    <div className="p-5 flex flex-col flex-1">
                                                        <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">{item.title}</h4>
                                                        
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="text-indigo-400 font-bold text-sm bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                                                                {item.price > 0 ? `Rp ${new Intl.NumberFormat('id-ID').format(item.price)}` : 'Gratis'}
                                                            </span>
                                                            <span className="text-gray-500 text-xs flex items-center gap-1">
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                                {item.total_uses || 0} Dipakai
                                                            </span>
                                                        </div>

                                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-3">
                                                            {item.description || "Tidak ada deskripsi atau batasan fitur yang diatur."}
                                                        </p>

                                                        <div className="flex gap-2 mt-auto">
                                                            <button 
                                                                onClick={() => {
                                                                    window.open(`/admin/builder/${item.id}`, '_blank');
                                                                }}
                                                                className="flex-1 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 rounded-lg font-bold text-sm transition-colors text-center"
                                                            >
                                                                Edit Template
                                                            </button>
                                                            <button 
                                                                onClick={async () => {
                                                                    try {
                                                                        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                                                                        const res = await axios.post(`/admin/invitation-portal/templates/${item.id}/duplicate`, {}, {
                                                                            headers: { 'X-CSRF-TOKEN': csrfToken }
                                                                        });
                                                                        if(res.data.success) {
                                                                            window.open(res.data.redirect_url, '_blank');
                                                                        }
                                                                    } catch (e) {
                                                                        alert('Gagal membuat proyek dari template');
                                                                    }
                                                                }}
                                                                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm transition-colors text-center"
                                                            >
                                                                Buat Proyek
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        )}
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </main>
            </div>
        </div>
    );
};

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ color: 'red', padding: '20px', background: '#fff', margin: '20px', borderRadius: '8px' }}>
                    <h2>React Crashed!</h2>
                    <p>{this.state.error && this.state.error.toString()}</p>
                    <pre style={{ fontSize: '10px' }}>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

const rootElement = document.getElementById('portal-root');
if (rootElement) {
    try {
        rootElement.innerHTML = '<h1 style="color:white; padding:20px;">Memuat React...</h1>';
        const root = createRoot(rootElement);
        root.render(
            <ErrorBoundary>
                <PortalApp />
            </ErrorBoundary>
        );
    } catch (e) {
        rootElement.innerHTML = `<div style="background:red; color:white; padding:20px; z-index:9999; position:absolute; top:0;">CRITICAL REACT ERROR: ${e.message}</div>`;
        console.error(e);
    }
} else {
    document.body.innerHTML += '<div style="background:red; color:white; padding:20px; z-index:9999; position:absolute; top:0;">CRITICAL: portal-root element not found!</div>';
}
