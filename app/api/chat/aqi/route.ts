import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const token = process.env.WAQI_TOKEN;

        if (!token) {
            return NextResponse.json({ aqi: null });
        }

        const res = await fetch(
            `https://api.waqi.info/feed/geo:34.0522;-118.2437/?token=${token}`
        );

        const data = await res.json();

        if (data.status === 'ok') {
            return NextResponse.json({ aqi: data.data.aqi });
        }

        return NextResponse.json({ aqi: null });
    } catch {
        return NextResponse.json({ aqi: null });
    }
}