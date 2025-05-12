import {
    APIStation,
    APIStationDetail,
    APIStationDetailResponse,
    APIStationResponse,
    ErrorResponse,
    ErrorType,
    SearchResult,
    Station,
    StationCollection,
} from "@/lib/definitions";
import { API_BASE, CACHE_TIMES, STATIONS_PER_PAGE } from "@/lib/constants";
import { getPlaiceholder } from "plaiceholder";
import { searchSchema, stationDetailsSchema, stationsSchema } from "@/lib/schemas";

async function fetchWithCache<T>(
    url: string,
    revalidateTime: number = CACHE_TIMES.ONE_DAY // 24h
): Promise<T> {
    const res = await fetch(url, {
        next: { revalidate: revalidateTime }
    });

    if (!res.ok) {
        const error = new Error(`API Error: ${res.status}`);
        (error as any).statusCode = res.status;
        (error as any).endpoint = url;
        (error as any).type = 'api';
        throw error;
    }

    try {
        return await res.json() as T;
    } catch (jsonError) {
        const error = new Error(`API Error: Failed to parse JSON response from ${url}`);
         (error as any).statusCode = res.status; // Keep status
         (error as any).endpoint = url;
         (error as any).type = 'api'; // Mark as API/parsing error
         (error as any).details = jsonError; // Add original parsing error
         throw error;
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
    rawCount: unknown = STATIONS_PER_PAGE,
    rawOffset: unknown = 0,
    delay: number | null = null
): Promise<StationCollection | ErrorResponse | null> {
    try {
        const parsedInput = stationsSchema.safeParse({
            count: rawCount,
            offset: rawOffset,
        });

        if (!parsedInput.success) {
            throw {
                type: 'validation',
                message: "Invalid parameters for getStations",
                details: parsedInput.error.errors
            };
        }

        const { count, offset } = parsedInput.data;
        const data = await fetchWithCache<APIStationResponse>(
            `${API_BASE}/list-by-system-name?systemName=STATIONS_TOP&count=${count}&offset=${offset}`,
            CACHE_TIMES.ONE_DAY
        );

        if (typeof delay === "number") {
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        const playables = data.playables || [];
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

    } catch (error: unknown) {
        const err = error as Partial<ErrorType> & { statusCode?: number; endpoint?: string; details?: unknown };

        const type = err.type ?? 'network';
        const message = err.message ?? "Failed to fetch stations";
        const details = err.details ?? error;

        console.error(`Error in getStations [${type}]:`, message, details);
        return {
            error: { type, message, details }
        };
    }
}

export async function getStationDetails(
    rawStationId: unknown,
    delay: number | null = null
): Promise<Station | ErrorResponse | null> {
    try {
        const parsedInput = stationDetailsSchema.safeParse({
            stationId: rawStationId
        });

        if (!parsedInput.success) {
            throw {
                type: 'validation',
                message: "Invalid parameters for getStationDetails",
                details: parsedInput.error.errors
            };
        }

        const { stationId } = parsedInput.data;
        const data = await fetchWithCache<APIStationDetailResponse>(
            `${API_BASE}/details?stationIds=${stationId}`,
            CACHE_TIMES.SEVEN_DAYS
        );

        const stationData = data?.[0];
        if (!stationData) return null;

        if (typeof delay === "number") {
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        return mapStation(stationData, true);

    } catch (error: unknown) {
        const err = error as Partial<ErrorType> & { statusCode?: number; endpoint?: string; details?: unknown };

        const type = err.type ?? 'network';
        const message = err.message ?? "Failed to fetch station details";
        const details = err.details ?? error;

        console.error(`Error in getStationDetails [${type}]:`, message, details);
        return {
            error: { type, message, details }
        };
    }
}

export async function getSearchResults(
    rawQuery: unknown,
    rawCount: unknown = STATIONS_PER_PAGE,
    rawOffset: unknown = 0
): Promise<SearchResult> {
    try {
        const parsedInput = searchSchema.safeParse({
            query: rawQuery,
            count: rawCount,
            offset: rawOffset,
        });

        if (!parsedInput.success) {
            throw {
                type: 'validation' as const,
                message: "Invalid search parameters",
                details: parsedInput.error.errors
            };
        }

        const { query, count, offset } = parsedInput.data;
        const data = await fetchWithCache<APIStationResponse>(
            `${API_BASE}/search?query=${encodeURIComponent(query)}&count=${count}&offset=${offset}`,
            CACHE_TIMES.ONE_HOUR
        );

        // Process successful response
        const playables = data.playables || [];
        const totalCount = data.totalCount || 0;

        const stations = await Promise.all(
            playables.map(async (item) => {
                const mappedStation = mapStation(item);
                mappedStation.blurDataURL = mappedStation.logo
                    ? await getBlurDataURL(mappedStation.logo)
                    : null;
                return mappedStation;
            })
        );

        return { stations, totalCount };

    } catch (error: unknown) {
        const err = error as Partial<ErrorType> & {
            statusCode?: number;
            endpoint?: string;
            details?: unknown
        };

        const type = err.type ?? 'network';
        const message = err.message ?? "Search failed";
        const details = err.details ?? error;

        console.error(`Error in getSearchResults [${type}]:`, message, details);
        return {
            error: { type, message, details }
        };
    }
}
