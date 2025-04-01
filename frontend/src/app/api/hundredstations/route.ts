import { getStations } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
    const result = await getStations(100, 0);
    return NextResponse.json(result.stations);
}