"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function NativeAudioPlayer({streamUrl}: { streamUrl: string; }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    // Event-Handler mit useCallback optimieren
    const handleCanPlay = useCallback((): void => {
        setIsLoaded(true);

        const audio = audioRef.current;
        if (audio) {
            audio.volume = 0.2;
        }

        // Autoplay feed
        const playPromise = audio?.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Autoplay started successfully');
                })
                .catch((error) => {
                    console.error('Autoplay failed:', error);
                });
        }
    }, []);

    const handleError = useCallback((): void => {
        console.error('Audio error');
        setIsError(true);
        setIsLoaded(false);
    }, []);

    // Setup-Funktion mit useCallback
    const setupAudio = useCallback((): void => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.src = streamUrl;
        audio.load(); // Ensure new source loaded

        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('error', handleError);
    }, [streamUrl, handleCanPlay, handleError]);

    const cleanupAudio = useCallback((): void => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
    }, [handleCanPlay, handleError]);

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
                autoPlay
                className={`w-full ${isLoaded ? 'visible' : 'invisible'}`}
            >
                Your browser does not support audio streaming.
            </audio>

            {isError && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-500 font-bold rounded-full">
                    Error loading audio stream
                </div>
            )}
        </div>
    );
}