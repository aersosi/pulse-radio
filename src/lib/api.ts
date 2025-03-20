import {
    Station,
    StationsResponse,
    APIStationResponse,
    APIStationDetailResponse,
    APIStation,
    APIStationDetail,
    ApiError,
} from "@/lib/definitions";
import { STATIONS_PER_PAGE } from "@/lib/constants";

const API_BASE = "https://prod.radio-api.net/stations";

function handleApiError<T>(error: unknown, returnValue: T, errorDescription: string): T {
    if (error instanceof Error) {
        const details = error as Error & Partial<ApiError>;
        console.error(
            `${errorDescription}:`,
            details.message,
            details.statusCode ? `Status: ${details.statusCode}` : '',
            details.endpoint ? `Endpoint: ${details.endpoint}` : ''
        );
    } else {
        console.error(`${errorDescription}: Unbekannter Fehler`, error);
    }
    return returnValue;
}

async function fetchWithCache<T>(
    url: string,
    defaultValue: T,
    revalidateTime: number = 86400
): Promise<T> {
    try {
        const res = await fetch(url, {
            next: {revalidate: revalidateTime}
        });

        if (!res.ok) {
            const error = new Error(`API Error: ${res.status}`);
            (error as Error & Partial<ApiError>).statusCode = res.status;
            (error as Error & Partial<ApiError>).endpoint = url;
            throw error;
        }

        return await res.json() as T;
    } catch (error: unknown) {
        return handleApiError<T>(error, defaultValue, `API Request failed for ${url}`);
    }
}

function mapStation(stationData: APIStation | APIStationDetail, detailed: boolean = false): Station {
    const station: Station = {
        id: stationData.id,
        name: stationData.name,
        logo: stationData.logo300x300 ?? "",
        topics: stationData.topics?.join(", ") || stationData.topics?.join(", ") || null,
    };
    if (!detailed) return station;

    const detailData = stationData as APIStationDetail;
    return {
        ...station,
        description: detailData.description || detailData.shortDescription || null,
        streamUrl: detailData.streams?.[0]?.url || null,
    };
}

export async function getStations(
    count: number = STATIONS_PER_PAGE,
    offset: number = 0,
    delay: number | null = null
): Promise<StationsResponse> {
    const data = await fetchWithCache<APIStationResponse>(
        `${API_BASE}/list-by-system-name?systemName=STATIONS_TOP&count=${count}&offset=${offset}`,
        {status: "error", timeStamp: new Date().toISOString(), totalCount: 0, playables: []}
    );

    if (typeof delay === "number") {
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    return {
        stations: data.playables.map(item => mapStation(item)),
        totalCount: data.totalCount || 0
    };
}

export async function getStationDetails(stationId: string, delay: number | null = null): Promise<Station | null> {
    const data = await fetchWithCache<APIStationDetailResponse>(
        `${API_BASE}/details?stationIds=${stationId}`,
        []
    );

    const station = data[0];
    if (!station) return null;

    if (typeof delay === "number") {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    return mapStation(station, true);
}