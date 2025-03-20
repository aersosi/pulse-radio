"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Skeleton } from "@/components/ui/skeleton";
import { START_VOLUME, TARGET_VOLUME, VOLUME_CLIMB_DURATION } from "@/lib/constants";
import { Button } from "@/components/ui/button";

type PlayerState = "error" | "loading" | "adjusting" | "ready";

export default function PlayerHLS({ url, title }: { url: string; title: string }) {
    const mediaRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [playerState, setPlayerState] = useState<PlayerState>("loading");
    const [volumePercentage, setVolumePercentage] = useState(0);

    const fadeInVolume = useCallback((media: HTMLMediaElement) => {
        if (!media) return;
        let startTime: number | null = null;

        media.volume = START_VOLUME;
        setPlayerState("adjusting");
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
                setPlayerState("ready");
            }
        };

        requestAnimationFrame(animateVolume);
    }, []);

    const handleCanPlay = useCallback((): void => {
        setPlayerState("ready");
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
        setPlayerState("error");
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
                const playPromise = media.play();
                setPlayerState("ready");

                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Autoplay started successfully');
                            fadeInVolume(media);
                        })
                        .catch((error) => {
                            console.error('Autoplay failed:', error);
                            setPlayerState("error");
                        });
                }
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error('Fatal HLS error:', data);
                    handleError();
                }
            });

            hls.attachMedia(media);
        } else if (media.canPlayType('application/vnd.apple.mpegurl')) {
            media.src = url;
            media.volume = START_VOLUME;
            const playPromise = media.play();
            setPlayerState("ready");

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Native HLS autoplay started successfully');
                        fadeInVolume(media);
                        media.focus();
                    })
                    .catch((error) => {
                        console.error('Native HLS autoplay failed:', error);
                        setPlayerState("error");
                    });
            }
        } else {
            console.error('HLS is not supported');
            setPlayerState("error");
        }
    }, [url, handleCanPlay, handleError, handlePlay, fadeInVolume]);

    useEffect(() => {
        setPlayerState("loading");
        setupHls();

        return cleanupHls;
    }, [setupHls, cleanupHls]);

    const getStatusMessage = (state: PlayerState) => {
        switch (state) {
            case "error":
                return <p className="text-destructive/90">Error loading audio. Please reload the page.</p>;
            case "loading":
                return <p className="text-green-500">Loading audio ...</p>;
            case "adjusting":
                return <p className="text-green-500">Adjusting volume ... ({volumePercentage}%)</p>;
            case "ready":
                return <p>Enjoy your radio! Increase the volume if you like.</p>;
        }
    };

    return (
        <div className="relative w-full max-w-[400px]" role="region" aria-label={`Audio Player: ${title}`}>
            {playerState === "error" && (
                <Button onClick={() => window.location.reload()}>Reload page</Button>
            )}

            {(playerState === "loading" || playerState === "adjusting") && (
                <Skeleton className="absolute h-[54px] w-full rounded-full" />
            )}

            <video
                ref={mediaRef}
                controls
                className={`w-full ${playerState === "ready" ? '' : 'invisible'}`}
                playsInline
                aria-describedby="playerStatus"
            />

            <div
                id="playerStatus"
                className="text-center text-sm text-muted-foreground py-4"
                aria-live="assertive"
                aria-atomic="true"
            >
                {getStatusMessage(playerState)}
            </div>
        </div>
    );
}