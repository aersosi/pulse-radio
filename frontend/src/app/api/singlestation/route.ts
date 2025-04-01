import { getStationDetails } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
    const station = await getStationDetails("1live");
    if (!station) return NextResponse.json({error: 'Station not found'}, {status: 404});
    return NextResponse.json(station);
}