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

        // Initialize Web Audio API ONLY ONCE per audio element to act as an impenetrable volume gate
        if (!audio.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audio.audioCtx = new AudioContext();
                try {
                    audio.sourceNode = audio.audioCtx.createMediaElementSource(audio);
                    audio.gainNode = audio.audioCtx.createGain();
                    
                    // Hardware-level volume lock BEFORE any sound can be played
                    audio.gainNode.gain.value = 0; 
                    
                    audio.sourceNode.connect(audio.gainNode);
                    audio.gainNode.connect(audio.audioCtx.destination);
                    console.log("Web Audio API GainNode initialized for flawless fade");
                } catch (e) {
                    console.warn("Web Audio API routing failed, falling back to HTML5 volume", e);
                }
            }
        }

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
        
        const applyVolume = (v) => {
            if (audio.gainNode && audio.audioCtx) {
                // Ensure context is running if we have user interaction
                if (audio.audioCtx.state === 'suspended' && !audio.paused) {
                    audio.audioCtx.resume();
                }
                audio.gainNode.gain.value = v; // Digital multiplication, 100% immune to browser bugs
                
                // Keep HTML volume at max so GainNode has full control, but fallback to v if GainNode fails
                if (audio.volume !== 1) audio.volume = 1; 
            } else {
                audio.volume = v; // Fallback
            }
        };

        // Mencegah patahan suara: set volume awal yang presisi
        applyVolume(getExpectedVolume(audio.currentTime));
        
        const updateAudio = () => {
            if (!audio || audio.paused) return;

            const current = audio.currentTime;
            const targetEnd = (end > 0 && end > start) ? end : audio.duration;
            
            // Handle looping back to start if we passed end
            if (targetEnd && current >= targetEnd) {
                audio.currentTime = start || 0;
                applyVolume(getExpectedVolume(start || 0));
                audio.play().catch(e => console.log(e));
                return;
            }

            applyVolume(getExpectedVolume(current));
            animationFrameId = requestAnimationFrame(updateAudio);
        };
        
        const handlePlay = () => {
            setIsPlaying(true);
            if (audio.audioCtx && audio.audioCtx.state === 'suspended') {
                audio.audioCtx.resume();
            }
            applyVolume(getExpectedVolume(audio.currentTime));
            animationFrameId = requestAnimationFrame(updateAudio);
        };

        const handlePause = () => {
            setIsPlaying(false);
            cancelAnimationFrame(animationFrameId);
        };

        const onLoadedMetadata = () => {
            if (start > 0 && audio.currentTime < start) {
                audio.currentTime = start;
                applyVolume(getExpectedVolume(start));
            }
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);

        // Jika autoplay diaktifkan, kita kendalikan secara manual via JS agar tidak didahului browser
        if (audioTrigger === 'autoplay' && audio.paused) {
            applyVolume(getExpectedVolume(audio.currentTime));
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
                if (audioRef.current.gainNode) {
                    audioRef.current.gainNode.gain.value = getExpectedVolume(start);
                } else {
                    audioRef.current.volume = getExpectedVolume(start);
                }
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
                        // Fallback pengaman volume HTML5, di-override oleh GainNode jika didukung
                        el.volume = 0;
                    }
                }}
                loop={end <= 0} // Native loop if no custom end time
                // autoPlay dihilangkan dari HTML murni agar bisa kita kontrol sepenuhnya via JS di useEffect
                crossOrigin="anonymous"
                preload="auto"
            >
                {/* Kembalikan media fragments url#t=... agar browser melakukan pre-seek secara native sehingga tidak patah (stutter). Kebocoran volumenya sekarang 100% ditahan oleh GainNode. */}
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
                            let targetVol = maxVol;
                            if (fadeIn > 0 && current < start + fadeIn) {
                                targetVol = Math.max(0, Math.min(maxVol, maxVol * (Math.max(0, current - start) / fadeIn)));
                            }
                            
                            if (audioRef.current.audioCtx && audioRef.current.audioCtx.state === 'suspended') {
                                audioRef.current.audioCtx.resume();
                            }
                            if (audioRef.current.gainNode) {
                                audioRef.current.gainNode.gain.value = targetVol;
                                audioRef.current.volume = 1;
                            } else {
                                audioRef.current.volume = targetVol;
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
