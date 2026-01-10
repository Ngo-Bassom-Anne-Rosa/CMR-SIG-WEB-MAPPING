
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const backendUrl = "https://cameroun-sig-api.onrender.com";

    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        const apiRes = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(data, { status: apiRes.status });
        }

        const response = NextResponse.json(data, { status: apiRes.status });

        // Forward any cookies from the backend
        const setCookieHeader = apiRes.headers.get('Set-Cookie');
        if (setCookieHeader) {
            // In Next.js 13+, you might need to handle multiple Set-Cookie headers correctly
            // as they might be combined into a single comma-separated string, which is not standard.
            // For simplicity here, we're assuming a single cookie or a compatible format.
            response.headers.set('Set-Cookie', setCookieHeader);
        }
        
        return response;

    } catch (error) {
        console.error("Login proxy error:", error);
        return NextResponse.json({ message: "An unexpected error occurred on the server." }, { status: 500 });
    }
}
