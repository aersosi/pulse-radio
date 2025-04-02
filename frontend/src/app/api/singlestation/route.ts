import { getStationDetails } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";
import { isTooManyRequests } from "@/lib/utils";

export async function GET(req: NextRequest) {
    const rateLimitResponse = await isTooManyRequests(req, 10, "min");
    if (rateLimitResponse) return rateLimitResponse;

    const station = await getStationDetails("1live");
    if (!station) return NextResponse.json({ error: "Station not found" }, { status: 404 });

    return NextResponse.json(station);
}