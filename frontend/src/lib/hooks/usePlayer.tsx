"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { START_VOLUME, TARGET_VOLUME, VOLUME_CLIMB_DURATION } from "@/lib/constants";
import { PlayerState, UsePlayerProps } from "@/lib/definitions";

export function usePlayer({ url, mediaType }: UsePlayerProps) {
    const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null);
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
        const hls = hlsRef.current;

        if (mediaType === "hls" && hls) {
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
    }, [handleCanPlay, handleError, handlePlay, mediaType]);

    const setupAudio = useCallback(() => {
        const media = mediaRef.current as HTMLAudioElement;
        if (!media) return;

        media.addEventListener('canplay', handleCanPlay);
        media.addEventListener('error', handleError);
        media.addEventListener('play', handlePlay);

        media.src = url;
        media.volume = START_VOLUME;
        setPlayerState("loading");

        media.load();
    }, [url, handleCanPlay, handleError, handlePlay]);

    const setupHLS = useCallback(() => {
        const media = mediaRef.current as HTMLVideoElement;
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
                setPlayerState("loading");
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
            setPlayerState("loading");
        } else {
            console.error('HLS is not supported');
            setPlayerState("error");
        }
    }, [url, handleCanPlay, handleError, handlePlay]);

    useLayoutEffect(() => {
        setPlayerState("loading");

        if (mediaType === "audio") {
            setupAudio();
        } else if (mediaType === "hls") {
            setupHLS();
        }

        return cleanup;
    }, [mediaType, setupAudio, setupHLS, cleanup]);

    // Status Message Funktion hier belassen, damit beide Komponenten sie nutzen können
    const getStatusMessage = (state: PlayerState) => {
        switch (state) {
            case "error":
                return <p className="text-destructive/90">Error loading audio. Please reload the page.</p>;
            case "loading":
                return <p className="text-green-700">Loading audio ...</p>;
            case "adjusting":
                return <p className="text-green-700">Adjusting volume ... ({volumePercentage}%)</p>;
            case "ready":
                return <p>Enjoy your radio! Increase the volume if you like.</p>;
        }
    };

    return {
        mediaRef,
        playerState,
        volumePercentage,
        getStatusMessage
    };
}