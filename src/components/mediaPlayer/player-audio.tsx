"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { usePlayer } from "./usePlayer";

export default function PlayerAudio({url, title}: { url: string; title: string }) {
    const { mediaRef, playerState, getStatusMessage } = usePlayer({
        url,
        mediaType: "audio"
    });

    return (
        <div className="relative w-full max-w-[400px] text-center" role="region" aria-label={`Audio Player: ${title}`}>
            {playerState === "error" && (
                <Button onClick={() => window.location.reload()}>Reload page</Button>
            )}

            {(playerState === "loading" || playerState === "adjusting") && (
                <Skeleton className="absolute h-[54px] w-full rounded-full"/>
            )}

            {playerState !== "error" && (
                <audio
                    ref={mediaRef as React.RefObject<HTMLAudioElement>}
                    controls
                    className={`w-full ${playerState === "ready" ? '' : 'invisible'}`}
                    aria-describedby="playerStatus"
                />
            )}


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