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
  timestamp: string;
  playables: APIStation[];
  totalCount?: number;
}

export type APIStationDetailResponse = APIStationDetail[];

export interface APIStreamItem {
  url: string;
  format?: string;
  bitrate?: number;
}

// Frontend model interfaces
export interface Station {
  id: string;
  name: string;
  logo: string;
  topics: string | null;
  description?: string | null;
  streamUrl?: string | null;
}
