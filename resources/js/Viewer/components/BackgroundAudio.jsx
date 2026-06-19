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
        
        // Ensure starting point
        const handlePlay = () => {
            setIsPlaying(true);
            
            // Set initial volume for fade-in or normal play
            if (audioFadeIn > 0 && audio.currentTime <= audioStart + 0.5) {
                audio.volume = 0;
            } else {
                audio.volume = maxVolume;
            }
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        const handleTimeUpdate = () => {
            if (!isPlaying) return;
            
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
        };

        const onLoadedMetadata = () => {
            if (audioStart > 0 && audio.currentTime < audioStart) {
                audio.currentTime = audioStart;
            }
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);

        // Optional Web Audio API for effects could be added here if needed,
        // but it requires AudioContext and CORS handling which can be tricky on cross-origin media.

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
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
            }
        }
    }, [audioStart, audioEnd]);

    if (!audioUrl) return null;

    return (
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
    );
};

export default BackgroundAudio;
