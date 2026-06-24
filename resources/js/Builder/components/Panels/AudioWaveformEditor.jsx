import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';

const AudioWaveformEditor = ({ 
    audioUrl, 
    audioStart, 
    audioEnd, 
    onSetStart, 
    onSetEnd 
}) => {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const wsRegions = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!waveformRef.current || !audioUrl) return;

        setIsReady(false);

        const audioEl = new Audio();
        audioEl.crossOrigin = "anonymous";

        wsRegions.current = RegionsPlugin.create();

        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: '#a5b4fc', // primary-300
            progressColor: '#db2777', // primary-600
            cursorColor: '#312e81', // primary-900
            barWidth: 2,
            barGap: 1,
            barRadius: 2,
            height: 60,
            normalize: true,
            sampleRate: 8000,
            media: audioEl,
            url: audioUrl,
            plugins: [wsRegions.current],
            fetchParams: {
                mode: 'cors',
            }
        });

        wavesurfer.current.on('error', (err) => {
            console.error("WaveSurfer Error:", err);
            setIsReady(true);
            setDuration(audioEl.duration || 0);
        });

        wavesurfer.current.on('ready', () => {
            setIsReady(true);
            const totalDuration = wavesurfer.current.getDuration();
            setDuration(totalDuration);
            
            // Strictly parse to float, handling Indonesian comma decimals
            const parseVal = (v) => {
                if (typeof v === 'number') return v;
                if (!v) return 0;
                const p = parseFloat(v.toString().replace(',', '.'));
                return isNaN(p) ? 0 : p;
            };
            
            const start = parseVal(audioStart);
            const endVal = parseVal(audioEnd);
            const end = endVal > 0 ? endVal : totalDuration;
            
            try {
                wsRegions.current.addRegion({
                    start: start,
                    end: end,
                    color: 'rgba(79, 70, 229, 0.4)', // primary-600 with higher opacity for visibility
                    drag: true,
                    resize: true,
                    id: 'cut-region'
                });
            } catch (e) {
                console.error("Failed to add region:", e);
            }

            if (start > 0 && start < totalDuration) {
                wavesurfer.current.setTime(start);
            }
        });

        wsRegions.current.on('region-updated', (region) => {
            if (region.id === 'cut-region') {
                const startStr = parseFloat(region.start.toFixed(2));
                const endStr = parseFloat(region.end.toFixed(2));
                
                const parseVal = (v) => {
                    if (typeof v === 'number') return v;
                    if (!v) return 0;
                    const p = parseFloat(v.toString().replace(',', '.'));
                    return isNaN(p) ? 0 : p;
                };
                const currentStart = parseVal(audioStart);
                const currentEnd = parseVal(audioEnd);

                // Update parent state safely without triggering infinite loops
                if (Math.abs(startStr - currentStart) > 0.05) onSetStart(startStr);
                if (currentEnd > 0 && Math.abs(endStr - currentEnd) > 0.05) onSetEnd(endStr);
                else if (currentEnd === 0 && Math.abs(endStr - wavesurfer.current.getDuration()) > 0.05) onSetEnd(endStr);
            }
        });

        audioEl.addEventListener('loadedmetadata', () => {
            if (!isReady) {
                setIsReady(true);
                setDuration(audioEl.duration);
            }
        });

        wavesurfer.current.on('audioprocess', () => {
            setCurrentTime(wavesurfer.current.getCurrentTime());
            // Stop if it hits the end of the region
            const regions = wsRegions.current.getRegions();
            const cutRegion = regions.find(r => r.id === 'cut-region');
            
            const parseVal = (v) => {
                if (typeof v === 'number') return v;
                if (!v) return 0;
                const p = parseFloat(v.toString().replace(',', '.'));
                return isNaN(p) ? 0 : p;
            };
            const currentStart = parseVal(audioStart);
            const currentEnd = parseVal(audioEnd);

            const endLimit = cutRegion ? cutRegion.end : currentEnd;
            
            if (endLimit > 0 && wavesurfer.current.getCurrentTime() >= endLimit) {
                wavesurfer.current.pause();
                wavesurfer.current.setTime(cutRegion ? cutRegion.start : currentStart);
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

    // Update region visually if props change from outside
    useEffect(() => {
        if (isReady && wsRegions.current) {
            const regions = wsRegions.current.getRegions();
            const cutRegion = regions.find(r => r.id === 'cut-region');
            if (cutRegion) {
                const parseVal = (v) => {
                    if (typeof v === 'number') return v;
                    if (!v) return 0;
                    const p = parseFloat(v.toString().replace(',', '.'));
                    return isNaN(p) ? 0 : p;
                };
                const newStart = parseVal(audioStart);
                const endVal = parseVal(audioEnd);
                const newEnd = endVal > 0 ? endVal : duration;
                
                // Avoid updating if the difference is tiny (prevents jitter)
                if (Math.abs(cutRegion.start - newStart) > 0.05 || Math.abs(cutRegion.end - newEnd) > 0.05) {
                    cutRegion.setOptions({
                        start: newStart,
                        end: newEnd
                    });
                }
            }
        }
    }, [audioStart, audioEnd, isReady, duration]);

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
                    <svg className="w-3 h-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Pemotong Pintar
                </span>
                <span className="text-[10px] font-mono font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
            </div>
            
            <div className="relative">
                <div ref={waveformRef} className="w-full h-[60px] bg-gray-50 rounded-lg border border-gray-100 overflow-hidden cursor-pointer" />
                {!isReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10 text-[10px] text-primary-500 font-bold animate-pulse pointer-events-none">
                        Memuat Gelombang...
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-3 gap-2">
                <button 
                    onClick={handlePlayPause}
                    disabled={!isReady}
                    className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition shadow disabled:opacity-50"
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
                        className="flex-1 px-2 py-1.5 text-[9px] font-bold bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition disabled:opacity-50"
                    >
                        Jadikan Mulai
                    </button>
                    <button 
                        onClick={handleSetEnd}
                        disabled={!isReady}
                        className="flex-1 px-2 py-1.5 text-[9px] font-bold bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition disabled:opacity-50"
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
