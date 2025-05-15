// API response interfaces
import { Station } from "@/lib/definitions/frontend";

export type APIStation = {
    id: string;
    name: string;
    logo300x300?: string | null;
    topics?: string[] | null;
    city?: string;
    country?: string;
    strikingColor1?: string;
    strikingColor2?: string;
}

export type APIStationDetail = APIStation & {
    description?: string | null;
    shortDescription?: string | null;
    streams?: APIStreamItem[] | null;
}

export type APIStationResponse = {
    status: string;
    timeStamp: string;
    playables: APIStation[];
    totalCount?: number;
}


export type APIStreamItem = {
    url: string;
    format?: string;
    bitrate?: number;
}

export type StationCollection = {
    stations: Station[];
    totalCount: number;
    error?: never;
};

export type ErrorType = {
    type: 'validation' | 'api' | 'network' | 'auth' | 'timeout';
    message: string;
    details?: unknown;
};

export type ErrorResponse = {
    stations?: never;
    totalCount?: never;
    error: ErrorType
};

export type SearchResult = StationCollection | ErrorResponse;