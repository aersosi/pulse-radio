import {AudioPlayerProps} from "@/lib/definitions";

export default function AudioPlayer({ streamUrl }: AudioPlayerProps) {
    if (!streamUrl) return null;

    return (
        <audio controls key={streamUrl}>
            <source src={streamUrl} type="audio/mpeg" />
            Your browser does not support audio streaming.
        </audio>
    );
}