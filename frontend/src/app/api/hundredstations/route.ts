import { getStations } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";
import { isTooManyRequests } from "@/lib/utils";

export async function GET(req: NextRequest) {
    const rateLimitResponse = await isTooManyRequests(req, 10, "min");
    if (rateLimitResponse) return rateLimitResponse;

    const result = await getStations(100, 0);
    if (!result) return NextResponse.json({ error: "No stations found" }, { status: 404 });

    return NextResponse.json(result.stations);
}