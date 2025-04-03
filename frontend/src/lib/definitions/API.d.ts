// API response interfaces
export type APIStation = {
    id: string;
    name: string;
    logo300x300?: string | null;
    topics?: string[] | null;
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

export type APIStationDetailResponse = APIStationDetail[];

export type APIStreamItem = {
    url: string;
    format?: string;
    bitrate?: number;
}

export type ApiError = {
    statusCode?: number;
    endpoint?: string;
}