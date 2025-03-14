import {
    Station,
    APIStationResponse,
    APIStationDetailResponse,
    APIStation,
    APIStationDetail,
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
 * @param detailed
 */
function mapStation(stationData: APIStation | APIStationDetail, detailed: boolean = false): Station {
    const station: Station = {
        id: stationData.id,
        name: stationData.name,
        logo: stationData.logo300x300 || "/no-image-available.webp",
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

        return data.playables.map(item => mapStation(item));
    } catch (error) {
        console.error("Error loading stations:", error instanceof Error ? error.message : String(error));
        return [];
    }
}

/**
 * Fetches details for a specific station by ID
 * @param stationId The unique station identifier
 * @param delay
 */
export async function getStationDetails(stationId: string, delay: number | null = null): Promise<Station | null> {
    try {
        const data = await fetchWithCache<APIStationDetailResponse>(
            `${API_BASE}/details?stationIds=${stationId}`
        );

        const station = data[0];
        if (!station) return null;

        if (typeof delay === "number") {
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        return mapStation(station, true);
    } catch (error) {
        console.error(`Error loading station ID ${stationId}:`, error instanceof Error ? error.message : String(error));
        return null;
    }
}