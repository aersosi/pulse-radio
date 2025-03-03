import {
    Station,
    StationDetail,
    APIStationResponse,
    APIStationDetailResponse,
    APIStationItem,
    APIStationDetailItem
} from "@/lib/definitions";

const API_BASE = "https://prod.radio-api.net/stations";

async function fetchWithCache<T>(url: string, revalidateTime: number = 86400): Promise<T> {
    try {
        const res = await fetch(url, {
            next: { revalidate: revalidateTime }
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`API Error ${res.status}: ${errorText}`);
        }

        return await res.json() as T;

    } catch (error) {
        // Differenziere Netzwerkfehler von Parse-Fehlern
        console.error("Fetch Error:", error instanceof Error ? error.message : "Unknown error");
        throw error; // Wichtig für Error Boundaries
    }
}

function mapToStation(stationData: APIStationItem): Station {
    return {
        id: stationData.id,
        name: stationData.name,
        logo: stationData.logo300x300 || null,
        genre: stationData.topics?.join(", ") || null,
    };
}

function mapToStationDetail(stationData: APIStationDetailItem): StationDetail {
    return {
        id: stationData.id,
        name: stationData.name,
        logo: stationData.logo300x300 || null,
        genre: stationData.genres || null,
        description: stationData.description || stationData.shortDescription || null,
        streamUrl: stationData.streams?.[0]?.url || null,
    };
}

export async function getTop100Stations(): Promise<Station[]> {
    try {
        const data = await fetchWithCache<APIStationResponse>(
            `${API_BASE}/list-by-system-name?systemName=STATIONS_TOP&count=100`
        );

        return data.playables.map(mapToStation);
    } catch (error) {
        console.error("Error loading top 100 stations:", error);
        return [];
    }
}

export async function getStationDetails(stationId: string): Promise<StationDetail | null> {
    try {
        const data = await fetchWithCache<APIStationDetailResponse>(
            `${API_BASE}/details?stationIds=${stationId}`
        );

        const station = data[0];

        if (!station) {
            console.error(`No details found for station ID ${stationId}`);
            return null;
        }

        return mapToStationDetail(station);
    } catch (error) {
        console.error(`Error loading station details for ID ${stationId}:`, error);
        return null;
    }
}