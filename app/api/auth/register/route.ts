
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const backendUrl =  "https://cameroun-sig-api.onrender.com";

    try {
        const body = await req.json();
        
        // Forward the entire body to the backend
        const apiRes = await fetch(`${backendUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await apiRes.json();

        if (!apiRes.ok) {
            return NextResponse.json(data, { status: apiRes.status });
        }
        
        const response = NextResponse.json(data, { status: apiRes.status });

        // Forward any cookies from the backend
        const setCookieHeader = apiRes.headers.get('Set-Cookie');
        if (setCookieHeader) {
            response.headers.set('Set-Cookie', setCookieHeader);
        }

        return response;

    } catch (error) {
        console.error("Registration proxy error:", error);
        return NextResponse.json({ message: "An unexpected error occurred on the server." }, { status: 500 });
    }
}
