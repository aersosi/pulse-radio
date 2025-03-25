import { getStationDetails } from "@/lib/api";

export async function GET() {
    const station = await getStationDetails("1live");
    return new Response(JSON.stringify(station), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}