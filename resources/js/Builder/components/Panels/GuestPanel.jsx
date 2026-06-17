import React, { useState } from 'react';
import useCanvasStore from '../../stores/useCanvasStore';
import apiClient from '../../utils/apiClient';

const GuestPanel = () => {
    const invitationId = useCanvasStore((state) => state.invitationId);
    const [file, setFile] = useState(null);

    const handleUploadCsv = async () => {
        if (!file || !invitationId) return;
        const formData = new FormData();
        formData.append('csv_file', file);
        
        try {
            await apiClient.post(`/api/builder/invitations/${invitationId}/guests/import`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Berhasil import CSV tamu!');
        } catch (error) {
            console.error('Error uploading CSV:', error);
            alert('Gagal mengimpor file CSV.');
        }
    };

    const handleBlastWA = async () => {
        if (!invitationId) return;
        try {
            await apiClient.post(`/api/builder/invitations/${invitationId}/guests/blast`);
            alert('Proses WhatsApp Blast telah masuk ke antrean background!');
        } catch (error) {
            console.error('Error starting WA Blast:', error);
            alert('Gagal memulai proses blast.');
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#2a2a2a', color: '#fff', height: '100%' }}>
            <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px' }}>
                Manajemen Tamu & CRM
            </h3>
            
            <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '10px' }}>Import Daftar Tamu (CSV)</label>
                <input 
                    type="file" 
                    accept=".csv" 
                    onChange={(e) => setFile(e.target.files[0])} 
                    style={{ marginBottom: '10px', fontSize: '12px' }} 
                />
                <button 
                    onClick={handleUploadCsv} 
                    style={{ padding: '8px 12px', width: '100%', cursor: 'pointer', borderRadius: '4px', border: 'none', background: '#4a90e2', color: '#fff' }}
                >
                    Upload & Simpan
                </button>
            </div>
            
            <div style={{ borderTop: '1px solid #444', paddingTop: '20px' }}>
                <p style={{ fontSize: '12px', color: '#ccc', marginBottom: '15px' }}>
                    Sistem akan membuat tautan unik per nama tamu dan mengirimkan undangan ke ratusan nomor di background secara aman.
                </p>
                <button 
                    onClick={handleBlastWA} 
                    style={{ padding: '12px 15px', width: '100%', cursor: 'pointer', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
                >
                    🚀 Eksekusi WhatsApp Blast
                </button>
            </div>
        </div>
    );
};

export default GuestPanel;
