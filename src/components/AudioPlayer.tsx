"use client";

import {useState, useEffect, useRef} from "react";
import {AudioPlayerProps} from "@/lib/definitions";

export default function AudioPlayer({streamUrl}: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Reset player state when URL changes
        setIsPlaying(false);
    }, [streamUrl]);

    const togglePlay = (): void => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(error => {
                    console.error("Audio playback error:", error);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
            <audio
                ref={audioRef}
                src={streamUrl}
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            >
                Your browser does not support audio streaming.
            </audio>
    );
}