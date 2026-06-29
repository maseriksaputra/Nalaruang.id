import React, { useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';

const BackgroundAudio = ({ settings }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const soundRef = useRef(null);
    const fadeTimerRef = useRef(null);
    
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
    const maxVol = Math.min(1, Math.max(0, (parseFloat(audioVolume) || 100) / 100));

    useEffect(() => {
        if (!audioUrl) return;

        // Destroy previous instance
        if (soundRef.current) {
            soundRef.current.unload();
            clearInterval(fadeTimerRef.current);
        }

        const spriteConfig = {};
        if (end > 0 && end > start) {
            spriteConfig.customLoop = [start * 1000, (end - start) * 1000, true];
        }

        const sound = new Howl({
            src: [audioUrl],
            html5: false, // Use Web Audio API for flawless volume control and preloading
            sprite: Object.keys(spriteConfig).length > 0 ? spriteConfig : undefined,
            loop: end <= 0,
            volume: 0, // Always initialize at 0 to prevent leaks
            preload: true,
            onload: () => {
                if (start > 0 && Object.keys(spriteConfig).length === 0) {
                    sound.seek(start);
                }
            },
            onplay: (id) => {
                setIsPlaying(true);
                clearInterval(fadeTimerRef.current);
                
                fadeTimerRef.current = setInterval(() => {
                    let currentPos = sound.seek(id);
                    if (typeof currentPos !== 'number') return;
                    
                    // Volume management
                    let currentVol = maxVol;
                    if (Object.keys(spriteConfig).length > 0) {
                        const duration = end - start;
                        if (fadeIn > 0 && currentPos < fadeIn) {
                            currentVol = maxVol * (currentPos / fadeIn);
                        } else if (fadeOut > 0 && currentPos > duration - fadeOut) {
                            currentVol = maxVol * ((duration - currentPos) / fadeOut);
                        }
                    } else {
                        if (fadeIn > 0 && currentPos < start + fadeIn) {
                            currentVol = maxVol * ((currentPos - start) / fadeIn);
                        } else if (fadeOut > 0 && end > 0 && currentPos > end - fadeOut) {
                            currentVol = maxVol * ((end - currentPos) / fadeOut);
                        }
                    }
                    
                    sound.volume(Math.max(0, Math.min(maxVol, currentVol)), id);
                }, 50); // 20fps volume check
            },
            onpause: () => {
                setIsPlaying(false);
                clearInterval(fadeTimerRef.current);
            },
            onstop: () => {
                setIsPlaying(false);
                clearInterval(fadeTimerRef.current);
            },
            onend: () => {
                if (end <= 0) {
                    sound.seek(start || 0);
                    sound.play();
                }
            }
        });

        soundRef.current = sound;

        let isPlayTriggered = false;
        const handlePlayEvent = () => {
            if (!sound.playing() && !isPlayTriggered) {
                isPlayTriggered = true;
                sound.volume(0); // Absolute lock before play
                if (Object.keys(spriteConfig).length > 0) {
                    sound.play('customLoop');
                } else {
                    if (start > 0) sound.seek(start);
                    sound.play();
                }
                setTimeout(() => { isPlayTriggered = false; }, 500);
            }
        };

        window.addEventListener('builder:play_background_audio', handlePlayEvent);

        // Jika autoplay
        if (audioTrigger === 'autoplay') {
            handlePlayEvent();
        }

        return () => {
            window.removeEventListener('builder:play_background_audio', handlePlayEvent);
            if (soundRef.current) {
                soundRef.current.unload();
                clearInterval(fadeTimerRef.current);
            }
        };
    }, [audioUrl, start, end, maxVol, fadeIn, fadeOut, audioTrigger]);

    // Handle preview seek changes
    useEffect(() => {
        if (soundRef.current && start > 0) {
            soundRef.current.seek(start);
            if (fadeIn > 0) {
                soundRef.current.volume(0);
            }
        }
    }, [start, fadeIn]);

    if (!audioUrl) return null;

    return (
        <button 
            onClick={() => {
                if (soundRef.current) {
                    if (isPlaying) {
                        soundRef.current.pause();
                    } else {
                        soundRef.current.volume(0);
                        soundRef.current.play();
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
    );
};

export default BackgroundAudio;
