import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const AudioWaveformEditor = ({ 
    audioUrl, 
    audioStart, 
    audioEnd, 
    onSetStart, 
    onSetEnd 
}) => {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!waveformRef.current || !audioUrl) return;

        setIsReady(false);

        // Initialize WaveSurfer with media element for faster playback
        const audioEl = new Audio();
        audioEl.crossOrigin = "anonymous";
        audioEl.src = audioUrl;
        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: '#a5b4fc', // indigo-300
            progressColor: '#4f46e5', // indigo-600
            cursorColor: '#312e81', // indigo-900
            barWidth: 2,
            barGap: 1,
            barRadius: 2,
            height: 60,
            normalize: true,
            sampleRate: 8000,
            media: audioEl,
        });

        // Load audio peaks (playback handles by media)
        wavesurfer.current.load(audioUrl);

        wavesurfer.current.on('error', (err) => {
            console.error("WaveSurfer Error:", err);
            // Tetap set ready agar user bisa play meskipun gelombang gagal dimuat
            setIsReady(true);
            setDuration(audioEl.duration || 0);
        });

        wavesurfer.current.on('ready', () => {
            setIsReady(true);
            setDuration(wavesurfer.current.getDuration());
            
            // If we have an audioStart, seek to it
            if (audioStart > 0 && audioStart < wavesurfer.current.getDuration()) {
                wavesurfer.current.setTime(audioStart);
            }
        });

        audioEl.addEventListener('loadedmetadata', () => {
            if (!isReady) {
                // Audio bisa di-play meskipun waveform belum selesai dirender
                setIsReady(true);
                setDuration(audioEl.duration);
            }
        });

        wavesurfer.current.on('audioprocess', () => {
            setCurrentTime(wavesurfer.current.getCurrentTime());
            // Stop if it hits audioEnd
            if (audioEnd > 0 && wavesurfer.current.getCurrentTime() >= audioEnd) {
                wavesurfer.current.pause();
                wavesurfer.current.setTime(audioStart || 0);
            }
        });

        wavesurfer.current.on('seek', () => {
            setCurrentTime(wavesurfer.current.getCurrentTime());
        });

        wavesurfer.current.on('play', () => setIsPlaying(true));
        wavesurfer.current.on('pause', () => setIsPlaying(false));

        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
            }
        };
    }, [audioUrl]);

    const handlePlayPause = () => {
        if (wavesurfer.current) {
            wavesurfer.current.playPause();
        }
    };

    const handleSetStart = () => {
        if (wavesurfer.current) {
            onSetStart(parseFloat(wavesurfer.current.getCurrentTime().toFixed(2)));
        }
    };

    const handleSetEnd = () => {
        if (wavesurfer.current) {
            onSetEnd(parseFloat(wavesurfer.current.getCurrentTime().toFixed(2)));
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00.00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const ms = Math.floor((time % 1) * 100);
        return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    };

    if (!audioUrl) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm my-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <svg className="w-3 h-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Pemotong Pintar
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
            </div>
            
            <div className="relative">
                <div ref={waveformRef} className="w-full h-[60px] bg-gray-50 rounded-lg border border-gray-100 overflow-hidden cursor-pointer" />
                {!isReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10 text-[10px] text-indigo-500 font-bold animate-pulse pointer-events-none">
                        Memuat Gelombang...
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-3 gap-2">
                <button 
                    onClick={handlePlayPause}
                    disabled={!isReady}
                    className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition shadow disabled:opacity-50"
                >
                    {isPlaying ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                        <svg className="w-4 h-4 pl-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                </button>

                <div className="flex gap-1.5 flex-1">
                    <button 
                        onClick={handleSetStart}
                        disabled={!isReady}
                        className="flex-1 px-2 py-1.5 text-[9px] font-bold bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-50"
                    >
                        Jadikan Mulai
                    </button>
                    <button 
                        onClick={handleSetEnd}
                        disabled={!isReady}
                        className="flex-1 px-2 py-1.5 text-[9px] font-bold bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-50"
                    >
                        Jadikan Selesai
                    </button>
                </div>
            </div>
            
            {(audioStart > 0 || audioEnd > 0) && (
                <div className="mt-3 flex gap-2">
                    {audioStart > 0 && <span className="text-[9px] font-semibold bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded">Mulai: {audioStart}s</span>}
                    {audioEnd > 0 && <span className="text-[9px] font-semibold bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded">Selesai: {audioEnd}s</span>}
                </div>
            )}
        </div>
    );
};

export default AudioWaveformEditor;
