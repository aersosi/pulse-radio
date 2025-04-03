import {
    Station,
    StationsResponse,
    APIStationResponse,
    APIStationDetailResponse,
    APIStation,
    APIStationDetail,
    ApiError,
} from "@/lib/definitions";
import { STATIONS_PER_PAGE, CACHE_TIMES } from "@/lib/constants";
import { getPlaiceholder } from "plaiceholder";

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
    revalidateTime: number = 86400 // 24h
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
        topics: stationData.topics?.join(", ") || null,
        blurDataURL: null
    };

    if (!detailed) return station;

    const detailData = stationData as APIStationDetail;
    return {
        ...station,
        description: detailData.description || detailData.shortDescription || null,
        streamUrl: detailData.streams?.[0]?.url || null,
    };
}


async function getBlurDataURL(imageUrl: string) {
    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();
    const {base64} = await getPlaiceholder(Buffer.from(buffer));
    return base64;
}

export async function getStations(
    count: number = STATIONS_PER_PAGE,
    offset: number = 0,
    delay: number | null = null
): Promise<StationsResponse> {
    const data = await fetchWithCache<APIStationResponse>(
        `${API_BASE}/list-by-system-name?systemName=STATIONS_TOP&count=${count}&offset=${offset}`,
        {status: "error", timeStamp: new Date().toISOString(), totalCount: 0, playables: []},
        CACHE_TIMES.STATION_LIST
    );

    if (typeof delay === "number") {
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    const stations = await Promise.all(
        data.playables.map(async (item) => {
            const mappedStation = mapStation(item);
            mappedStation.blurDataURL = mappedStation.logo
                ? await getBlurDataURL(mappedStation.logo)
                : null;
            return mappedStation;
        })
    );

    return {
        stations,
        totalCount: data.totalCount || 0
    };
}


export async function getStationDetails(stationId: string, delay: number | null = null): Promise<Station | null> {
    const data = await fetchWithCache<APIStationDetailResponse>(
        `${API_BASE}/details?stationIds=${stationId}`,
        [],
        CACHE_TIMES.STATION_DETAILS
    );

    const station = data[0];
    if (!station) return null;

    if (typeof delay === "number") {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    return mapStation(station, true);
}

export async function getSearchResults(
    query: string,
    count: number = STATIONS_PER_PAGE,
    offset: number = 0
): Promise<StationsResponse> {
    try {
        const data = await fetchWithCache<APIStationResponse>(
            `${API_BASE}/search?query=${encodeURIComponent(query)}&count=${count}&offset=${offset}`,
            {status: "error", timeStamp: new Date().toISOString(), totalCount: 0, playables: []},
            CACHE_TIMES.SEARCH_RESULTS
        );

        // Stelle sicher, dass playables immer ein Array ist
        const playables = data.playables || [];

        // Wenn die Seite außerhalb des gültigen Bereichs liegt, gib leere Ergebnisse zurück
        const totalPages = Math.ceil((data.totalCount || 0) / count);
        const currentPage = Math.floor(offset / count) + 1;

        if (currentPage > totalPages && totalPages > 0) {
            return {
                stations: [],
                totalCount: data.totalCount || 0
            };
        }

        const stations = await Promise.all(
            playables.map(async (item) => {
                const mappedStation = mapStation(item);
                mappedStation.blurDataURL = mappedStation.logo
                    ? await getBlurDataURL(mappedStation.logo)
                    : null;
                return mappedStation;
            })
        );

        return {
            stations,
            totalCount: data.totalCount || 0
        };
    } catch (error) {
        console.error('Error in getSearchResults:', error);
        return {
            stations: [],
            totalCount: 0
        };
    }
}