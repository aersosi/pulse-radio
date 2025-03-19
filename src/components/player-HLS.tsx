"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Skeleton } from "@/components/ui/skeleton";
import { START_VOLUME, TARGET_VOLUME, VOLUME_CLIMB_DURATION } from "@/lib/constants";

export default function PlayerHLS({url, title}: { url: string; title: string }) {
    const mediaRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isFadingVolume, setIsFadingVolume] = useState<boolean>(false);
    const [volumePercentage, setVolumePercentage] = useState(0);

    const fadeInVolume = useCallback((media: HTMLMediaElement) => {
        if (!media) return;
        let startTime: number | null = null;

        media.volume = START_VOLUME;
        setIsFadingVolume(true);
        setVolumePercentage(START_VOLUME * 100);

        const animateVolume = (timeStamp: number) => {
            if (!startTime) startTime = timeStamp;
            const elapsed = timeStamp - startTime;
            const progress = Math.min(elapsed / VOLUME_CLIMB_DURATION, 1);

            media.volume = progress * TARGET_VOLUME;
            setVolumePercentage(Math.round(media.volume * 100));

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

        const media = mediaRef.current;
        if (media) {
            media.volume = START_VOLUME;
        }
    }, []);

    const handlePlay = useCallback(() => {
        const media = mediaRef.current;
        if (media && media.volume <= START_VOLUME) {
            fadeInVolume(media);
            media.focus();
        }
    }, [fadeInVolume]);

    const handleError = useCallback((): void => {
        console.error('Audio error');
        setIsError(true);
        setIsLoaded(false);
    }, []);

    const cleanupHls = useCallback((): void => {
        const media = mediaRef.current;
        const hls = hlsRef.current;

        if (hls) {
            hls.destroy();
            hlsRef.current = null;
        }

        if (media) {
            media.removeEventListener('canplay', handleCanPlay);
            media.removeEventListener('error', handleError);
            media.removeEventListener('play', handlePlay);
            media.pause();
            media.removeAttribute('src');
            media.load();
        }
    }, [handleCanPlay, handleError, handlePlay]);

    const setupHls = useCallback((): void => {
        const media = mediaRef.current;
        if (!media) return;

        media.addEventListener('canplay', handleCanPlay);
        media.addEventListener('error', handleError);
        media.addEventListener('play', handlePlay);

        if (Hls.isSupported()) {
            const hls = new Hls();
            hlsRef.current = hls;
            hls.loadSource(url);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                media.volume = START_VOLUME;
                const playPromise = media?.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Autoplay started successfully');
                            fadeInVolume(media);
                        })
                        .catch((error) => {
                            console.error('Autoplay failed:', error);
                        });
                }
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) handleError();
            });

            hls.attachMedia(media);
        } else if (media.canPlayType('application/vnd.apple.mpegurl')) {
            media.src = url;
            media.volume = START_VOLUME;
            const playPromise = media.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Native HLS autoplay started successfully');
                        fadeInVolume(media);
                        media.focus();
                    })
                    .catch((error) => {
                        console.error('Native HLS autoplay failed:', error);
                    });
            }
        }
    }, [url, handleCanPlay, handleError, handlePlay, fadeInVolume]);

    useEffect(() => {
        setIsLoaded(false);
        setIsError(false);
        setIsFadingVolume(false);
        setupHls();

        // Cleanup on unmount or URL change
        return cleanupHls;
    }, [setupHls, cleanupHls]);

    const playerStatusMessage = () => {
        switch (true) {
            case isError:
                return <p className="text-destructive/90">Error loading audio ...</p>;
            case !isLoaded:
                return <p className="text-green-500">Loading audio ...</p>;
            case isFadingVolume:
                return <p className="text-green-500">Adjusting volume ... ({volumePercentage}%)</p>;
            default:
                return <p>Enjoy your Radio and increase volume if you like!</p>;
        }
    };

    return (
        <div className="relative w-full max-w-[400px]" role="region" aria-label={`Audio Player: ${title}`}>
            {!isLoaded && !isError && (
                <Skeleton className="absolute h-[54px] w-full rounded-full"/>
            )}

            <video
                ref={mediaRef}
                controls
                className={`w-full ${!isLoaded ? 'invisible' : ''}`}
                playsInline
                aria-describedby="playerStatus"
            />

            <div id="playerStatus"
                 className="text-center text-sm text-muted-foreground py-4"
                 aria-live="assertive"
                 aria-atomic="true"
            >
                {playerStatusMessage()}
            </div>
        </div>
    );
}