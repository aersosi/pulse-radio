// API Types
interface APIBaseStation {
    id: string;
    name: string;
    logo44x44?: string;
    logo300x300?: string;
}

export type APIStationResponse = {
    playables: APIStationItem[];
};

export interface APIStationItem extends APIBaseStation {
    topics?: string[];
}

export type APIStationDetailResponse = APIStationDetailItem[];

export interface APIStationDetailItem extends APIBaseStation {
    genres?: string[];
    description?: string;
    shortDescription?: string;
    streams?: APIStreamItem[];
}

export interface APIStreamItem {
    url: string;
    format?: string;
    bitrate?: number;
}

// Component Types
export interface Station {
    id: string;
    name: string;
    logoSmall: string | null;
    logo: string | null;
    genre: string | null;
}

export interface StationCardProps {
    station: Station;
}

export interface StationDetailPageProps {
    params: { id: string };
}

export interface StationDetail extends Omit<Station, 'genre'> {
    genre: string[] | null;
    description: string | null;
    streamUrl: string | null;
}

export interface StationListProps {
    stations: Station[] | null;
}

export interface AudioPlayerProps {
    streamUrl: string | null;
}
