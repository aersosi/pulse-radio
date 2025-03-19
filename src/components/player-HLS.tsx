"use client";

import { JSX, useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineError } from "@/components/error-alert";
import { START_VOLUME, TARGET_VOLUME, VOLUME_CLIMB_DURATION } from "@/lib/constants";

export default function PlayerHLS({url, title}: { url: string; title: string; }): JSX.Element {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | undefined>(undefined);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isFadingVolume, setIsFadingVolume] = useState<boolean>(false);

    const fadeInVolume = useCallback((video: HTMLVideoElement, startVolume = 0, targetVolume = 0.3, duration = 3000) => {
        if (!video) return;
        let startTime: number | null = null;

        video.volume = startVolume;
        setIsFadingVolume(true);

        const animateVolume = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            video.volume = progress * targetVolume;

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

        const video = videoRef.current;
        if (video) {
            video.volume = START_VOLUME;
        }
    }, []);

    const handlePlay = useCallback(() => {
        const video = videoRef.current;
        if (video && video.volume <= START_VOLUME) {
            fadeInVolume(video, START_VOLUME, TARGET_VOLUME, VOLUME_CLIMB_DURATION);
            video.focus();
        }
    }, [fadeInVolume]);

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
        video.addEventListener('play', handlePlay);

        if (Hls.isSupported()) {
            const hls = new Hls();
            hlsRef.current = hls;
            hls.loadSource(url);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.volume = START_VOLUME;
                const playPromise = video?.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Autoplay started successfully');
                            fadeInVolume(video, START_VOLUME, TARGET_VOLUME, VOLUME_CLIMB_DURATION);
                        })
                        .catch((error) => {
                            console.error('Autoplay failed:', error);
                        });
                }
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) handleError();
            });

            hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.volume = START_VOLUME;
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Native HLS autoplay started successfully');
                        fadeInVolume(video, START_VOLUME, TARGET_VOLUME, VOLUME_CLIMB_DURATION);
                        video.focus();
                    })
                    .catch((error) => {
                        console.error('Native HLS autoplay failed:', error);
                    });
            }
        }
    }, [url, handleCanPlay, handleError, handlePlay, fadeInVolume]);

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
            video.removeEventListener('play', handlePlay);
            video.pause();
            video.removeAttribute('src');
            video.load();
        }
    }, [handleCanPlay, handleError, handlePlay]);

    useEffect(() => {
        setIsLoaded(false);
        setIsError(false);
        setIsFadingVolume(false);
        setupHls();

        // Cleanup on unmount or URL change
        return cleanupHls;
    }, [setupHls, cleanupHls]);

    return (
        <div className="relative w-full max-w-[400px]">
            {!isLoaded && !isError && (
                <Skeleton className="absolute h-[54px] w-full rounded-full"/>
            )}

            <video
                ref={videoRef}
                controls
                className={`w-full ${!isLoaded ? 'invisible' : ''}`}
                playsInline
                role="application"
                aria-label={`Audio-Player, streaming: ${title}`}
                aria-describedby="playerStatus"
            />

            <div id="playerStatus"
                 className="text-center text-sm text-muted-foreground py-4"
                 aria-live="assertive"
                 aria-atomic="true"

            >
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
};