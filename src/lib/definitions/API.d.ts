// API response interfaces
export interface APIStation {
    id: string;
    name: string;
    logo300x300?: string | null;
    topics?: string[] | null;
}

export interface APIStationDetail extends APIStation {
    description?: string | null;
    shortDescription?: string | null;
    streams?: APIStreamItem[] | null;
}

export interface APIStationResponse {
    status: string;
    timeStamp: string;
    playables: APIStation[];
    totalCount?: number;
}

export type APIStationDetailResponse = APIStationDetail[];

export interface APIStreamItem {
    url: string;
    format?: string;
    bitrate?: number;
}

export interface ApiError {
    statusCode?: number;
    endpoint?: string;
}