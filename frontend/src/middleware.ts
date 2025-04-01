import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isAllowedHost(request: NextRequest): boolean {
    const requestHost = request.headers.get('host');
    const isDevelopment = process.env.NEXT_PUBLIC_ENV === 'development';

    const allowedHosts = [
        process.env.VERCEL_URL,
        process.env.APP_URL?.replace(/https?:\/\//, ''),
    ].filter(Boolean);

    if (isDevelopment && requestHost?.startsWith('localhost:')) {
        console.log(`Allowed development host: ${requestHost}`);
        return true;
    }

    if (requestHost && allowedHosts.includes(requestHost)) {
        console.log(`Allowed production host: ${requestHost}`);
        return true;
    }

    console.log(`Denied host: ${requestHost}. Allowed hosts: ${allowedHosts.join(', ')}`);
    return false;
}

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
        if (!isAllowedHost(request)) {
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized: Access restricted to allowed hosts.' }),
                {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};