// API response interfaces
export interface APIResponse {
  status: string;
  timestamp: string;
}

export interface APIStationItem {
  id: string;
  name: string;
  logo44x44?: string | null;
  logo300x300?: string | null;
  topics?: string[] | null;
}

export interface APIStationResponse extends APIResponse {
  playables: APIStationItem[];
  totalCount?: number;
}

export interface APIStationDetailItem {
  id: string;
  name: string;
  logo44x44?: string | null;
  logo300x300?: string | null;
  genres?: string[] | null;
  description?: string | null;
  shortDescription?: string | null;
  streams?: APIStreamItem[] | null;
}

export type APIStationDetailResponse = APIStationDetailItem[];

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
  genre: string | null;
}

export interface StationDetail extends Station {
  description: string | null;
  streamUrl: string | null;
}

// Component props interfaces
export interface StationListProps {
  stations: Station[];
  isLoading?: boolean;
}

export interface StationCardProps {
  station: Station;
}

export interface AudioPlayerProps {
  streamUrl: string;
}

export interface RevalidationResponse {
  success: boolean;
  message: string;
}

export interface HLSPlayerProps {
  url: string;
}

export interface AudioPlayerProps {
  streamUrl: string;
}