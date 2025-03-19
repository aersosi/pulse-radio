"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineError } from "@/components/errorAlert";
import { START_VOLUME, TARGET_VOLUME, VOLUME_CLIMB_DURATION } from "@/lib/constants";

export default function NativeAudioPlayer({streamUrl}: { streamUrl: string; }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isFadingVolume, setIsFadingVolume] = useState<boolean>(false);

    const fadeInVolume = useCallback((audio: HTMLAudioElement, startVolume = 0, targetVolume = 0.3, duration = 3000) => {
        if (!audio) return;
        let startTime: number | null = null;

        audio.volume = startVolume;
        setIsFadingVolume(true);

        const animateVolume = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            audio.volume = progress * targetVolume;

            if (progress < 1) {
                requestAnimationFrame(animateVolume);
            } else {
                setIsFadingVolume(false);
            }
        };

        requestAnimationFrame(animateVolume);
    }, []);

    const handleCanPlay = useCallback((): void => {
        setIsLoaded(true);

        const audio = audioRef.current;
        if (audio) {
            audio.volume = START_VOLUME;

            // Try autoplay
            const playPromise = audio?.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Autoplay started successfully');
                        fadeInVolume(audio, START_VOLUME, TARGET_VOLUME, VOLUME_CLIMB_DURATION);
                    })
                    .catch((error) => {
                        console.error('Autoplay failed:', error);
                        // Kein setState für autoplayBlocked mehr notwendig, da wir immer den nativen Player anzeigen
                    });
            }
        }
    }, [fadeInVolume]);

    const handlePlay = useCallback(() => {
        const audio = audioRef.current;
        if (audio && audio.volume <= START_VOLUME) {
            fadeInVolume(audio, START_VOLUME, TARGET_VOLUME, VOLUME_CLIMB_DURATION);
        }
    }, [fadeInVolume]);

    const handleError = useCallback((): void => {
        console.error('Audio error');
        setIsError(true);
        setIsLoaded(false);
    }, []);

    const setupAudio = useCallback((): void => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.src = streamUrl;
        audio.load(); // Ensure new source loaded

        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('error', handleError);
        audio.addEventListener('play', handlePlay);
    }, [streamUrl, handleCanPlay, handleError, handlePlay]);

    const cleanupAudio = useCallback((): void => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('play', handlePlay);
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
    }, [handleCanPlay, handleError, handlePlay]);

    useEffect(() => {
        setIsLoaded(false);
        setIsError(false);
        setupAudio();

        // Cleanup on unmount or URL change
        return cleanupAudio;
    }, [setupAudio, cleanupAudio]);

    return (
        <div className="relative w-full max-w-[400px]">
            {!isLoaded && !isError && (
                <Skeleton className="absolute h-[54px] w-full rounded-full"/>
            )}

            <audio
                ref={audioRef}
                controls
                className={`w-full ${!isLoaded ? 'invisible' : ''}`}
            >
                Your browser does not support audio streaming.
            </audio>

            <div className="text-center text-sm text-muted-foreground py-4">
                {!isLoaded && !isError && (
                    <p className="text-green-500">Loading audio ... </p>
                )}

                {isLoaded && isFadingVolume && (
                    <p className="text-green-500">Adjusting volume ...</p>
                )}

                {isLoaded && !isFadingVolume && (
                    <p>Enjoy your Radio and increase volume if you like!</p>
                )}
            </div>

            {isError && (
                <InlineError
                    title="Streaming Error"
                    description="Could not load the audio stream."
                    onClose={() => setIsError(false)}
                />
            )}
        </div>
    );
}