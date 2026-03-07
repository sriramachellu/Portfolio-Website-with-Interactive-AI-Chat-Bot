import { NextResponse } from 'next/server';
import { getNowPlaying } from '@/lib/spotify';

let cache: { data: any; ts: number } | null = null;
const CACHE_TTL = 25_000;

export async function GET() {
    try {
        if (cache && Date.now() - cache.ts < CACHE_TTL) {
            return NextResponse.json(cache.data);
        }

        const response = await getNowPlaying();

        if (response.status === 204 || response.status > 400) {
            if (process.env.NODE_ENV !== 'production') console.log('Spotify API returned status:', response.status);
            const data = { isPlaying: false };
            cache = { data, ts: Date.now() };
            return NextResponse.json(data);
        }

        const song = await response.json();
        if (process.env.NODE_ENV !== 'production') console.log('Spotify Raw Item:', song.item?.name);

        if (song.item === null) {
            const data = { isPlaying: false };
            cache = { data, ts: Date.now() };
            return NextResponse.json(data);
        }

        const isPlaying = song.is_playing;
        const title = song.item.name;
        const artist = song.item.artists.map((_artist: any) => _artist.name).join(', ');
        const album = song.item.album.name;
        const albumImageUrl = song.item.album.images[0].url;
        const songUrl = song.item.external_urls.spotify;

        const data = {
            album,
            albumImageUrl,
            artist,
            isPlaying,
            songUrl,
            title,
        };

        cache = { data, ts: Date.now() };
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('API Route Error:', error.message);
        return NextResponse.json({ isPlaying: false }, { status: 500 });
    }
}
