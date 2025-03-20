"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { START_VOLUME, TARGET_VOLUME, VOLUME_CLIMB_DURATION } from "@/lib/constants";
import { Button } from "@/components/ui/button";

type PlayerState = "error" | "loading" | "adjusting" | "ready";

export default function PlayerAudio({url, title}: { url: string; title: string }) {
    const mediaRef = useRef<HTMLAudioElement | null>(null);
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
        const media = mediaRef.current;
        if (!media) return;

        const playPromise = media.play();
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
    }, [fadeInVolume]);

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

    const cleanup = useCallback((): void => {
        const media = mediaRef.current;

        if (media) {
            media.removeEventListener('canplay', handleCanPlay);
            media.removeEventListener('error', handleError);
            media.removeEventListener('play', handlePlay);
            media.pause();
            media.removeAttribute('src');
            media.load();
        }
    }, [handleCanPlay, handleError, handlePlay]);

    const setup = useCallback((): void => {
        const media = mediaRef.current;
        if (!media) return;

        media.addEventListener('canplay', handleCanPlay);
        media.addEventListener('error', handleError);
        media.addEventListener('play', handlePlay);

        media.src = url;
        media.volume = START_VOLUME;
        setPlayerState("loading");

        media.load();
    }, [url, handleCanPlay, handleError, handlePlay]);

    useEffect(() => {
        setPlayerState("loading");
        setup();

        return cleanup;
    }, [setup, cleanup]);

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

            <audio
                ref={mediaRef}
                controls
                className={`w-full ${playerState === "ready" ? '' : 'invisible'}`}
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