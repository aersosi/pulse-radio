// Frontend model interfaces
export type Station = {
  id: string;
  name: string;
  logo: string;
  blurDataURL: string | null;
  topics: string | null;
  description?: string | null;
  streamUrl?: string | null;
}

export type StationsResponse = {
  stations: Station[];
  totalCount: number;
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
