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

        let animationFrameId;

        const getExpectedVolume = (current) => {
            const targetEnd = (audioEnd > 0 && audioEnd > audioStart) ? audioEnd : audio.duration;
            if (audioFadeIn > 0 && current < audioStart + audioFadeIn) {
                const progress = Math.max(0, current - audioStart) / audioFadeIn;
                return Math.max(0, Math.min(maxVolume, progress * maxVolume));
            } else if (audioFadeOut > 0 && targetEnd && current > targetEnd - audioFadeOut) {
                const progress = Math.max(0, targetEnd - current) / audioFadeOut;
                return Math.max(0, Math.min(maxVolume, progress * maxVolume));
            }
            return maxVolume;
        };
        
        // Mencegah patahan suara saat autoplay: set volume awal yang presisi
        audio.volume = getExpectedVolume(audio.currentTime);
        
        const updateAudio = () => {
            if (!audio || audio.paused) return;

            const current = audio.currentTime;
            const targetEnd = (audioEnd > 0 && audioEnd > audioStart) ? audioEnd : audio.duration;
            
            // Handle looping back to start if we passed audioEnd
            if (targetEnd && current >= targetEnd) {
                audio.currentTime = audioStart || 0;
                audio.volume = getExpectedVolume(audioStart || 0);
                audio.play().catch(e => console.log(e));
                return;
            }

            audio.volume = getExpectedVolume(current);
            animationFrameId = requestAnimationFrame(updateAudio);
        };
        
        // Ensure starting point
        const handlePlay = () => {
            setIsPlaying(true);
            audio.volume = getExpectedVolume(audio.currentTime);
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
                audio.volume = getExpectedVolume(audioStart);
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
                audioRef.current.currentTime = audioStart;
                // Kami biarkan updateAudio yang akan menangkap volume yang benar di frame berikutnya, 
                // atau jika sedang pause, kami paksa volume di update
                const getExpectedVolume = (current) => {
                    if (audioFadeIn > 0 && current < audioStart + audioFadeIn) {
                        return Math.max(0, Math.min(1, Math.max(0, audioVolume / 100)) * (Math.max(0, current - audioStart) / audioFadeIn));
                    }
                    return Math.min(1, Math.max(0, audioVolume / 100));
                };
                audioRef.current.volume = getExpectedVolume(audioStart);
            }
        }
    }, [audioStart, audioEnd, audioFadeIn, audioVolume]);

    if (!audioUrl) return null;

    return (
        <>
            <audio 
                id="background-audio" 
                ref={(el) => {
                    audioRef.current = el;
                    if (el && audioFadeIn > 0) {
                        // Secara sinkron mengatur volume 0 di mount
                        if (el.currentTime <= audioStart) {
                            el.volume = 0;
                        }
                    }
                }}
                loop={audioEnd <= 0} // Native loop if no custom end time
                autoPlay={audioTrigger === 'autoplay'}
                crossOrigin="anonymous"
            >
                {/* Gunakan media fragments url#t=... untuk native browser seeking sebelum mendownload audio */}
                <source src={`${audioUrl}#t=${audioStart || 0}`} type="audio/mpeg" />
                <source src={`${audioUrl}#t=${audioStart || 0}`} type="audio/wav" />
                <source src={`${audioUrl}#t=${audioStart || 0}`} type="audio/ogg" />
            </audio>

            {/* Floating Speaker Control */}
            <button 
                onClick={() => {
                    if (audioRef.current) {
                        if (isPlaying) {
                            audioRef.current.pause();
                        } else {
                            // Kalkulasi volume presisi saat tombol play ditekan agar tidak ada suara bocor
                            let current = audioRef.current.currentTime;
                            let maxVol = Math.min(1, Math.max(0, audioVolume / 100));
                            if (audioFadeIn > 0 && current < audioStart + audioFadeIn) {
                                audioRef.current.volume = Math.max(0, Math.min(maxVol, maxVol * (Math.max(0, current - audioStart) / audioFadeIn)));
                            } else {
                                audioRef.current.volume = maxVol;
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
