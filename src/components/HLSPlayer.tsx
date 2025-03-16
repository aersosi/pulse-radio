"use client";

import { JSX, useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Skeleton } from "@/components/ui/skeleton";

const HLSPlayer: ({url}: { url: string }) => JSX.Element = ({url}: { url: string }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | undefined>(undefined);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const handleCanPlay = useCallback((): void => {
        const video = videoRef.current;
        if (video) {
            video.volume = 0.2;
        }
        setIsLoaded(true);
    }, []);

    const handleError = useCallback((): void => {
        console.error('Video error');
        setIsError(true);
        setIsLoaded(false);
    }, []);

    const setupHls = useCallback((): void => {
        const video = videoRef.current;
        if (!video) return;

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('error', handleError);

        if (Hls.isSupported()) {
            const hls = new Hls();
            hlsRef.current = hls;
            hls.loadSource(url);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video?.play().catch(() => {
                });
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) handleError();
            });

            hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.play().catch(() => {
            });
        }
    }, [url, handleCanPlay, handleError]);

    const cleanupHls = useCallback((): void => {
        const video = videoRef.current;
        const hls = hlsRef.current;

        if (hls) {
            hls.destroy();
            hlsRef.current = undefined;
        }

        if (video) {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
            video.pause();
            video.removeAttribute('src');
            video.load();
        }
    }, [handleCanPlay, handleError]);

    useEffect(() => {
        setIsLoaded(false);
        setIsError(false);
        setupHls();

        return cleanupHls;
    }, [setupHls, cleanupHls]);

    return (
        <div className="relative w-full max-w-[400px]">
            {!isLoaded && !isError && (
                <Skeleton className="absolute h-full w-full rounded-full"/>
            )}

            <video
                ref={videoRef}
                controls
                autoPlay
                className={`w-full ${isLoaded ? 'visible' : 'invisible'}`}
                playsInline
            />

            {isError && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-500 font-bold rounded-full">
                    Error loading HLS stream
                </div>
            )}
        </div>
    );
};

export default HLSPlayer;