"use client";

import { JSX, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Skeleton } from "@/components/ui/skeleton";

const HLSPlayer: ({url}: { url: string }) => JSX.Element = ({ url }:{ url:string }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        let hls: Hls | undefined;
        const video = videoRef.current;

        setIsLoaded(false);
        setIsError(false);

        const handleCanPlay = () => {
            if (video) {
                video.volume = 0.2;
                console.log('Video ready - Volume set to:', video.volume);
            }
            setIsLoaded(true);
        };

        const handleError = () => {
            console.error('Video error');
            setIsError(true);
            setIsLoaded(false);
        };

        if (video) {
            video.addEventListener('canplay', handleCanPlay);
            video.addEventListener('error', handleError);
        }

        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(url);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video?.play().catch(() => {});
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) handleError();
            });

            if (video) hls.attachMedia(video);
        } else if (video?.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.play().catch(() => {});
        }

        return () => {
            if (hls) hls.destroy();
            if (video) {
                video.removeEventListener('canplay', handleCanPlay);
                video.removeEventListener('error', handleError);
                video.pause();
                video.removeAttribute('src');
                video.load();
            }
        };
    }, [url]);

    return (
        <div className="relative w-full max-w-[400px]">
            {!isLoaded && !isError && (
                <Skeleton className="absolute h-full w-full rounded-full" />
            )}

            <video
                ref={videoRef}
                controls
                autoPlay
                className={`w-full ${isLoaded ? 'visible' : 'invisible'}`}
                playsInline
            />

            {isError && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-500">
                    Error loading stream
                </div>
            )}
        </div>
    );
};

export default HLSPlayer;