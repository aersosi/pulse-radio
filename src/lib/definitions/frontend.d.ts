// Frontend model interfaces
export interface Station {
  id: string;
  name: string;
  logo: string;
  topics: string | null;
  description?: string | null;
  streamUrl?: string | null;
}

export interface StationsResponse {
  stations: Station[];
  totalCount: number;
}