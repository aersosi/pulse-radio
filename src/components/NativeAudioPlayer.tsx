"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {AudioPlayerProps} from "@/lib/definitions";


export default function NativeAudioPlayer({ streamUrl }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        const audio = audioRef.current;

        // Reset states when URL changes
        setIsLoaded(false);
        setIsError(false);

        const handleCanPlay = () => {
            console.log('Audio can play');
            setIsLoaded(true);

            if (audio) {
                audio.volume = 0.2;
            }

            // Attempt to autoplay
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
        };

        const handleError = () => {
            console.error('Audio error');
            setIsError(true);
            setIsLoaded(false);
        };

        if (audio) {
            audio.src = streamUrl;
            audio.load(); // Ensure the new source is loaded

            // Add event listeners
            audio.addEventListener('canplay', handleCanPlay);
            audio.addEventListener('error', handleError);
        }

        // Cleanup on unmount or URL change
        return () => {
            if (audio) {
                audio.removeEventListener('canplay', handleCanPlay);
                audio.removeEventListener('error', handleError);
                audio.pause();
                audio.removeAttribute('src');
                audio.load();
            }
        };
    }, [streamUrl]);

    return (
        <div className="relative w-full max-w-[400px]">
            {!isLoaded && !isError && (
                <Skeleton className="absolute h-[54px] w-full rounded-full" />
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
                <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-500">
                    Error loading audio stream
                </div>
            )}
        </div>
    );
}