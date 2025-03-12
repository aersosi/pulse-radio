import {
    Station,
    StationDetail,
    APIStationResponse,
    APIStationDetailResponse,
    APIStationItem,
    APIStationDetailItem,
    RevalidationResponse,
} from "@/lib/definitions";

const API_BASE = "https://prod.radio-api.net/stations";

/**
 * Fetches data with cache control
 * @param url API endpoint URL
 * @param revalidateTime Cache duration in seconds
 */
async function fetchWithCache<T>(url: string, revalidateTime: number = 86400): Promise<T> {
    try {
        const res = await fetch(url, {
            next: {revalidate: revalidateTime}
        });

        if (!res.ok) {
            throw new Error(`API Error: ${res.status}`);
        }

        return await res.json() as T;
    } catch (error) {
        console.error("API Error:", error instanceof Error ? error.message : String(error));
        throw error;
    }
}

/**
 * Maps API station data to frontend Station model
 * @param stationData Raw station data from API
 */
function mapToStation(stationData: APIStationItem): Station {
    return {
        id: stationData.id,
        name: stationData.name,
        logo: stationData.logo300x300 || "/no-image-available.webp",
        genre: stationData.topics?.join(", ") || null,
    };
}

/**
 * Maps API station detail data to frontend StationDetail model
 * @param stationData Raw station detail data from API
 */
function mapToStationDetail(stationData: APIStationDetailItem): StationDetail {
    return {
        id: stationData.id,
        name: stationData.name,
        logo: stationData.logo300x300 || "/no-image-available.webp",
        genre: stationData.genres?.join(", ") || null,
        description: stationData.description || stationData.shortDescription || null,
        streamUrl: stationData.streams?.[0]?.url || null,
    };
}

/**
 * Fetches totalCount
 */
export async function totalCount(): Promise<number> {
    try {
        const data = await fetchWithCache<APIStationResponse>(
            `${API_BASE}/list-by-system-name?systemName=STATIONS_TOP&count=100`
        );
        return data.totalCount || 0;
    } catch (error) {
        console.error("Error loading totalCount:", error instanceof Error ? error.message : String(error));
        return 0;
    }
}

/**
 * Fetches radio stations
 */
export async function getStations(count: number = 5, offset: number = 0, delay: number | null = null): Promise<Station[]> {
    try {
        const data = await fetchWithCache<APIStationResponse>(
            `${API_BASE}/list-by-system-name?systemName=STATIONS_TOP&count=${count}&offset=${offset}`
        );

        // Mock a delayed api request to test loading state
        if (typeof delay === "number") {
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        return data.playables.map(mapToStation);
    } catch (error) {
        console.error("Error loading top stations:", error instanceof Error ? error.message : String(error));
        return [];
    }
}

/**
 * Fetches details for a specific station by ID
 * @param stationId The unique station identifier
 */
export async function getStationDetails(stationId: string): Promise<StationDetail | null> {
    try {
        const data = await fetchWithCache<APIStationDetailResponse>(
            `${API_BASE}/details?stationIds=${stationId}`
        );

        const station = data[0];
        if (!station) return null;

        return mapToStationDetail(station);
    } catch (error) {
        console.error(`Error loading station details for ID ${stationId}:`,
            error instanceof Error ? error.message : String(error));
        return null;
    }
}

/**
 * Revalidates the cache for a specific station
 * For use in an API route
 * @param stationId The station to revalidate
 * @param secretToken Security token for validation
 */
export async function revalidateStation(
    stationId: string,
    secretToken: string
): Promise<RevalidationResponse> {
    if (secretToken !== process.env.REVALIDATE_TOKEN) {
        return {success: false, message: 'Invalid security token'};
    }

    try {
        // Would use revalidatePath in an API route
        return {success: true, message: 'Station cache successfully updated'};
    } catch (error) {
        console.error('Revalidation error:',
            error instanceof Error ? error.message : String(error));
        return {success: false, message: 'Error during revalidation'};
    }
}