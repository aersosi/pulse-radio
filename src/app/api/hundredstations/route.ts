import { getStations } from "@/lib/api";

export async function GET() {
    const stations = await getStations(100,0);
    return new Response(JSON.stringify(stations), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}