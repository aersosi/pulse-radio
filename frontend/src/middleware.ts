import { NextResponse } from "next/server";

async function checkToken() {
    const accessToken = process.env.VERCEL_ACCESS_TOKEN;
    const projectID = process.env.VERCEL_PROJECT_ID;

    try {
        const response = await fetch(`https://api.vercel.com/v9/projects/${projectID}/env`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.ok;
    } catch (error) {
        console.error("Error checking Vercel token:", error);
        return false;
    }
}

export async function middleware() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isTokenValid = await checkToken();

    // Return 401 for protected routes: if not in development & invalid vercel token
    if (!isDevelopment && !isTokenValid) {
        return NextResponse.json(
            {error: "Unauthorized: Invalid or missing Vercel token"},
            {status: 401}
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*"],
};