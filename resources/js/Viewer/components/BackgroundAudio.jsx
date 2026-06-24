import React, { useEffect, useRef, useState } from 'react';

const BackgroundAudio = ({ settings }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const {
        audioUrl,
        audioTrigger = 'onclick',
        audioStart = 0,
        audioEnd = 0,
        audioVolume = 100,
        audioFadeIn = 0,
        audioFadeOut = 0,
        audioEffect = 'none'
    } = settings || {};

    const start = parseFloat(audioStart) || 0;
    const end = parseFloat(audioEnd) || 0;
    const fadeIn = parseFloat(audioFadeIn) || 0;
    const fadeOut = parseFloat(audioFadeOut) || 0;
    const vol = parseFloat(audioVolume) !== undefined && !isNaN(parseFloat(audioVolume)) ? parseFloat(audioVolume) : 100;
    const maxVol = Math.min(1, Math.max(0, vol / 100));

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !audioUrl) return;

        let animationFrameId;

        const getExpectedVolume = (current) => {
            const targetEnd = (end > 0 && end > start) ? end : audio.duration;
            if (fadeIn > 0 && current < start + fadeIn) {
                const progress = Math.max(0, current - start) / fadeIn;
                return Math.max(0, Math.min(maxVol, progress * maxVol));
            } else if (fadeOut > 0 && targetEnd && current > targetEnd - fadeOut) {
                const progress = Math.max(0, targetEnd - current) / fadeOut;
                return Math.max(0, Math.min(maxVol, progress * maxVol));
            }
            return maxVol;
        };
        
        // Mencegah patahan suara: set volume awal yang presisi
        audio.volume = getExpectedVolume(audio.currentTime);
        
        const updateAudio = () => {
            if (!audio || audio.paused) return;

            const current = audio.currentTime;
            const targetEnd = (end > 0 && end > start) ? end : audio.duration;
            
            // Handle looping back to start if we passed end
            if (targetEnd && current >= targetEnd) {
                audio.currentTime = start || 0;
                audio.volume = getExpectedVolume(start || 0);
                audio.play().catch(e => console.log(e));
                return;
            }

            audio.volume = getExpectedVolume(current);
            if (audio.muted && fadeIn > 0) {
                audio.muted = false; // Buka mute hanya setelah volume dijamin terkunci di perhitungan
            }
            animationFrameId = requestAnimationFrame(updateAudio);
        };
        
        const handlePlay = () => {
            setIsPlaying(true);
            audio.volume = getExpectedVolume(audio.currentTime);
            if (audio.muted && fadeIn > 0) audio.muted = false;
            animationFrameId = requestAnimationFrame(updateAudio);
        };

        const handlePause = () => {
            setIsPlaying(false);
            cancelAnimationFrame(animationFrameId);
        };

        const onLoadedMetadata = () => {
            if (start > 0 && audio.currentTime < start) {
                audio.currentTime = start;
                audio.volume = getExpectedVolume(start);
            }
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);

        // Jika autoplay diaktifkan, kita kendalikan secara manual via JS agar tidak didahului browser
        if (audioTrigger === 'autoplay' && audio.paused) {
            audio.volume = getExpectedVolume(audio.currentTime);
            if (fadeIn > 0) audio.muted = true;
            audio.play().catch(e => console.log("Autoplay prevented:", e));
        }

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            cancelAnimationFrame(animationFrameId);
        };
    }, [audioUrl, start, end, vol, fadeIn, fadeOut, isPlaying, audioTrigger]);

    // Apply start time whenever it changes (e.g. from the builder preview)
    useEffect(() => {
        if (audioRef.current && start > 0) {
            const targetEnd = end > 0 ? end : audioRef.current.duration;
            if (audioRef.current.currentTime < start || (targetEnd && audioRef.current.currentTime > targetEnd)) {
                audioRef.current.currentTime = start;
                const getExpectedVolume = (current) => {
                    if (fadeIn > 0 && current < start + fadeIn) {
                        return Math.max(0, Math.min(maxVol, maxVol * (Math.max(0, current - start) / fadeIn)));
                    }
                    return maxVol;
                };
                audioRef.current.volume = getExpectedVolume(start);
            }
        }
    }, [start, end, fadeIn, maxVol]);

    if (!audioUrl) return null;

    return (
        <>
            <audio 
                id="background-audio" 
                ref={(el) => {
                    audioRef.current = el;
                    if (el && fadeIn > 0) {
                        // Secara sinkron mengatur volume dan mute di DOM
                        el.muted = true;
                        el.volume = 0;
                    }
                }}
                loop={end <= 0} // Native loop if no custom end time
                // autoPlay dihilangkan dari HTML murni agar bisa kita kontrol sepenuhnya via JS di useEffect
                crossOrigin="anonymous"
            >
                {/* Gunakan media fragments url#t=... untuk native browser seeking */}
                <source src={`${audioUrl}#t=${start || 0}`} type="audio/mpeg" />
                <source src={`${audioUrl}#t=${start || 0}`} type="audio/wav" />
                <source src={`${audioUrl}#t=${start || 0}`} type="audio/ogg" />
            </audio>

            {/* Floating Speaker Control */}
            <button 
                onClick={() => {
                    if (audioRef.current) {
                        if (isPlaying) {
                            audioRef.current.pause();
                        } else {
                            // Kalkulasi volume presisi saat tombol play ditekan
                            let current = audioRef.current.currentTime;
                            if (fadeIn > 0 && current < start + fadeIn) {
                                audioRef.current.volume = Math.max(0, Math.min(maxVol, maxVol * (Math.max(0, current - start) / fadeIn)));
                            } else {
                                audioRef.current.volume = maxVol;
                            }
                            if (audioRef.current.muted && fadeIn > 0) audioRef.current.muted = false;
                            audioRef.current.play().catch(e => console.log(e));
                        }
                    }
                }}
                className={`fixed bottom-6 right-6 z-[9999] w-11 h-11 bg-white/40 backdrop-blur-md border border-white/50 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white/60 hover:scale-110 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}
                title={isPlaying ? "Jeda Musik" : "Putar Musik"}
            >
                {isPlaying ? (
                    <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                ) : (
                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                )}
            </button>
        </>
    );
};

export default BackgroundAudio;
