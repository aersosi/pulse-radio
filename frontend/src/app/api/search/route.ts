import { NextRequest, NextResponse } from "next/server";
import { getSearchResults } from "@/lib/api";
import { isTooManyRequests } from "@/lib/utils";

export async function GET(req: NextRequest) {
    const rateLimitResponse = await isTooManyRequests(req, 10, "min");
    if (rateLimitResponse) return rateLimitResponse;

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const count = parseInt(searchParams.get('count') || '5', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    try {
        const result = await getSearchResults(query, count, offset);
        return NextResponse.json(result);
    } catch (error) {
        console.log(error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch search results.' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );


    }
}