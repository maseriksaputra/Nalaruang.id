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

    const maxVolume = Math.min(1, Math.max(0, audioVolume / 100));

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !audioUrl) return;

        // Mencegah patahan suara saat autoplay: set volume ke 0 sesegera mungkin
        if (audioFadeIn > 0 && audio.currentTime <= audioStart + 0.5) {
            audio.volume = 0;
        }

        let animationFrameId;
        
        const updateAudio = () => {
            if (!audio || audio.paused) return;

            const current = audio.currentTime;
            const targetEnd = (audioEnd > 0 && audioEnd > audioStart) ? audioEnd : audio.duration;
            
            // Handle looping back to start if we passed audioEnd
            if (targetEnd && current >= targetEnd) {
                audio.currentTime = audioStart || 0;
                if (audioFadeIn > 0) {
                    audio.volume = 0;
                }
                audio.play().catch(e => console.log(e));
                return;
            }

            // Handle Fade In
            if (audioFadeIn > 0 && current < audioStart + audioFadeIn) {
                const progress = (current - audioStart) / audioFadeIn;
                const newVol = progress * maxVolume;
                audio.volume = Math.max(0, Math.min(maxVolume, newVol));
            } 
            // Handle Fade Out
            else if (audioFadeOut > 0 && targetEnd && current > targetEnd - audioFadeOut) {
                const progress = (targetEnd - current) / audioFadeOut;
                const newVol = progress * maxVolume;
                audio.volume = Math.max(0, Math.min(maxVolume, newVol));
            } 
            // Normal Volume
            else {
                audio.volume = maxVolume;
            }

            animationFrameId = requestAnimationFrame(updateAudio);
        };
        
        // Ensure starting point
        const handlePlay = () => {
            setIsPlaying(true);
            
            // Set initial volume for fade-in or normal play
            if (audioFadeIn > 0 && audio.currentTime <= audioStart + 0.5) {
                audio.volume = 0;
            } else {
                audio.volume = maxVolume;
            }

            // Mulai loop update di setiap frame (60fps) untuk transisi super halus
            animationFrameId = requestAnimationFrame(updateAudio);
        };

        const handlePause = () => {
            setIsPlaying(false);
            cancelAnimationFrame(animationFrameId);
        };

        const onLoadedMetadata = () => {
            if (audioStart > 0 && audio.currentTime < audioStart) {
                audio.currentTime = audioStart;
            }
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);

        // Optional Web Audio API for effects could be added here if needed,
        // but it requires AudioContext and CORS handling which can be tricky on cross-origin media.

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            cancelAnimationFrame(animationFrameId);
        };
    }, [audioUrl, audioStart, audioEnd, audioVolume, audioFadeIn, audioFadeOut, isPlaying]);

    // Apply audioStart whenever it changes (e.g. from the builder preview)
    useEffect(() => {
        if (audioRef.current && audioStart > 0) {
            // Only seek if we are outside the valid window
            const end = audioEnd > 0 ? audioEnd : audioRef.current.duration;
            if (audioRef.current.currentTime < audioStart || (end && audioRef.current.currentTime > end)) {
                if (audioFadeIn > 0) {
                    audioRef.current.volume = 0;
                }
                audioRef.current.currentTime = audioStart;
            }
        }
    }, [audioStart, audioEnd, audioFadeIn]);

    if (!audioUrl) return null;

    return (
        <>
            <audio 
                id="background-audio" 
                ref={audioRef}
                loop={audioEnd <= 0} // Native loop if no custom end time
                autoPlay={audioTrigger === 'autoplay'}
                crossOrigin="anonymous"
            >
                <source src={audioUrl} type="audio/mpeg" />
                <source src={audioUrl} type="audio/wav" />
                <source src={audioUrl} type="audio/ogg" />
            </audio>

            {/* Floating Speaker Control */}
            <button 
                onClick={() => {
                    if (audioRef.current) {
                        if (isPlaying) {
                            audioRef.current.pause();
                        } else {
                            // Mencegah patahan suara: Set volume ke 0 SEBELUM memanggil play() jika berada di titik awal fade-in
                            if (audioFadeIn > 0 && audioRef.current.currentTime <= audioStart + 0.5) {
                                audioRef.current.volume = 0;
                            }
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
