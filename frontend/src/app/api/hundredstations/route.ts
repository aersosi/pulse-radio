import { getStations } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";
import { isTooManyRequests } from "@/lib/utils";

export async function GET(req: NextRequest) {
    const rateLimitResponse = await isTooManyRequests(req, 10, "min");
    if (rateLimitResponse) return rateLimitResponse;


    const result = await getStations(100, 0);
    return NextResponse.json(result.stations);
}