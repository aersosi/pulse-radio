import { APIStreamItem } from "@/lib/definitions/API";

export type Station = {
    id: string;
    name: string;
    logo300x300?: string;
    topics: string | null;

    city?: string | null;
    country?: string | null;
    strikingColor1?: string | null;
    strikingColor2?: string | null;

    blurDataURL: string | null;
    description?: string | null;
    streamUrl?: string | null;
}

export type PlayerState = "error" | "loading" | "adjusting" | "ready";

export type UsePlayerProps = {
    url: string;
    mediaType: "audio" | "hls";
};


type CommonSearchProps = {
    onRemove: (e: React.MouseEvent, query: string) => void;
    onSelect: (query: string) => void;
};

export type RecentSearchesPopoverProps = CommonSearchProps & {
    width?: number | null;
    recentSearches: string[];
    onRemoveAll: (e: React.MouseEvent) => void;
};

export type RecentSearchItemProps = CommonSearchProps & {
    search: string;
};