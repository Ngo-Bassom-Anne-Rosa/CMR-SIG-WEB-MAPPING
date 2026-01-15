
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const backendUrl = `${baseUrl}/api/auth/register`;

    try {
        const body = await req.json();
        
        const apiRes = await fetch(backendUrl, {
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
