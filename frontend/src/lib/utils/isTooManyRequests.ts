import { Interval, RateLimiter } from "limiter";
import { NextResponse } from "next/server";

let limiter: RateLimiter;

export async function isTooManyRequests(req: Request, tokensPerInterval: number = 10, interval: Interval = "min"): Promise<NextResponse | null> {
    if (!limiter) {
        limiter = new RateLimiter({
            tokensPerInterval,
            interval,
            fireImmediately: true,
        });
    }
    const remaining = await limiter.removeTokens(1);
    const origin = req.headers.get("origin") || "*";

    if (remaining < 0) {
        return new NextResponse("Too many requests", {
            status: 429,
            headers: {
                "Access-Control-Allow-Origin": origin,
                "Content-Type": "text/plain",
            },
        });
    }

    return null;
}