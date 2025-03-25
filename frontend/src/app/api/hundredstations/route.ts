import { getStations } from "@/lib/api";

export async function GET() {
    const result = await getStations(100, 0);
    return new Response(JSON.stringify(result.stations), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}