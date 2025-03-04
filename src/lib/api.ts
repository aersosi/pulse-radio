import {
    Station,
    StationDetail,
    APIStationResponse,
    APIStationDetailResponse,
    APIStationItem,
    APIStationDetailItem
} from "@/lib/definitions";

const API_BASE = "https://prod.radio-api.net/stations";

async function fetchWithCache<T>(
    url: string,
    options: {
        cache?: "force-cache" | "no-store"
        revalidate?: number
        tags?: string[]
    } = {},
): Promise<T> {
    const { cache = "force-cache", revalidate, tags } = options

    try {
        const res = await fetch(url, {
            cache,
            next: {
                ...(revalidate !== undefined ? { revalidate } : {}),
                ...(tags ? { tags } : {}),
            },
        })

        if (!res.ok) {
            const errorText = await res.text()
            throw new Error(`API Error ${res.status}: ${errorText}`)
        }

        return (await res.json()) as T
    } catch (error) {
        console.error("Fetch Error:", error instanceof Error ? error.message : "Unknown error")
        throw error
    }
}

function mapToStation(stationData: APIStationItem): Station {
    return {
        id: stationData.id,
        name: stationData.name,
        logoSmall: stationData.logo44x44 || null,
        logo: stationData.logo300x300 || null,
        genre: stationData.topics?.join(", ") || null,
    };
}

function mapToStationDetail(stationData: APIStationDetailItem): StationDetail {
    return {
        id: stationData.id,
        name: stationData.name,
        logoSmall: stationData.logo44x44 || null,
        logo: stationData.logo300x300 || null,
        genre: stationData.genres || null,
        description: stationData.description || stationData.shortDescription || null,
        streamUrl: stationData.streams?.[0]?.url || null,
    };
}

export async function getTop100Stations(): Promise<Station[]> {
    try {
        const data = await fetchWithCache<APIStationResponse>(
            `${API_BASE}/list-by-system-name?systemName=STATIONS_TOP&count=100`,
            {
                cache: "force-cache",
                tags: ["stations"],
            },
        )

        return data.playables.map(mapToStation)
    } catch (error) {
        console.error("Error loading top 100 stations:", error)
        return []
    }
}

export async function getStationDetails(stationId: string): Promise<StationDetail | null> {
    try {
        const data = await fetchWithCache<APIStationDetailResponse>(`${API_BASE}/details?stationIds=${stationId}`, {
            cache: "force-cache",
            tags: [`station-${stationId}`, "stations"],
        })

        const station = data[0]

        if (!station) {
            console.error(`No details found for station ID ${stationId}`)
            return null
        }

        return mapToStationDetail(station)
    } catch (error) {
        console.error(`Error loading station details for ID ${stationId}:`, error)
        return null
    }
}

export async function prefetchStationDetails(stationIds: string[]): Promise<Record<string, StationDetail | null>> {
    try {
        const batchSize = 10
        const results: Record<string, StationDetail | null> = {}

        for (let i = 0; i < stationIds.length; i += batchSize) {
            const batch = stationIds.slice(i, i + batchSize)
            const promises = batch.map((id) => getStationDetails(id))
            const detailsArray = await Promise.all(promises)

            batch.forEach((id, index) => {
                results[id] = detailsArray[index]
            })
        }

        return results
    } catch (error) {
        console.error("Error prefetching station details:", error)
        return {}
    }
}