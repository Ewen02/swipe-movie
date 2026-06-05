import { ImageResponse } from 'next/og';
import { getPublicMovieDetails } from '@/lib/movies-public';

export const runtime = 'nodejs';
// Cache the generated card for 30d. The match OG (film, poster, year) is
// immutable once the match exists; Satori rendering on nodejs is CPU-heavy and
// social bots hit unbounded match IDs, so without this the route re-generates
// the image per crawl — a driver of Fluid Active CPU.
export const revalidate = 2592000; // 30d
export const alt = 'Swipe Movie Match';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Params = { locale: string; id: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function getPublicMatch(matchId: string) {
  try {
    const res = await fetch(`${API_URL}/matches/${matchId}/public`, {
      // The OG card (film title, poster, year) is effectively immutable once the
      // match exists, so there's no reason to re-render+re-write this image
      // hourly. Social bots hit unbounded match IDs — a long window slashes the
      // ISR Write Units this route generates.
      next: { revalidate: 2592000 }, // 30d
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function MatchOg({ params }: { params: Params }) {
  const match = await getPublicMatch(params.id);
  const movieId = match ? parseInt(match.movieId) : NaN;
  const movie = !isNaN(movieId)
    ? await getPublicMovieDetails(movieId, params.locale, 'movie')
    : null;

  const title = movie?.title ?? 'Swipe Movie';
  const year = movie?.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;
  const rating = movie && movie.voteAverage > 0 ? movie.voteAverage.toFixed(1) : null;

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0520 40%, #0a0a1a 100%)',
        color: 'white',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      {/* Decorative glow */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: -150,
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, #ec489944 0%, transparent 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -200,
          right: -100,
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, #8b5cf644 0%, transparent 70%)',
        }}
      />

      {/* Movie poster */}
      {movie?.posterUrl ? (
        <img
          src={movie.posterUrl}
          alt=""
          width={320}
          height={480}
          style={{
            width: 320,
            height: 480,
            borderRadius: 24,
            objectFit: 'cover',
            margin: '75px 40px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            border: '3px solid rgba(236, 72, 153, 0.4)',
          }}
        />
      ) : null}

      {/* Text content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 60px 60px 20px',
        }}
      >
        {/* Match badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 36,
            fontWeight: 800,
            marginBottom: 24,
            backgroundImage: 'linear-gradient(90deg, #ec4899, #a855f7)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          🎉 It's a Match!
        </div>

        {/* Movie title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 16,
            color: '#ffffff',
          }}
        >
          {title}
        </div>

        {/* Year and rating */}
        <div
          style={{
            display: 'flex',
            gap: 18,
            fontSize: 24,
            color: '#cbd5e1',
            marginBottom: 32,
          }}
        >
          {year ? <span>{year}</span> : null}
          {rating ? <span>★ {rating}/10</span> : null}
          {match?.voteCount ? (
            <span>❤️ {match.voteCount} votes</span>
          ) : null}
        </div>

        {/* Branding */}
        <div
          style={{
            display: 'flex',
            fontSize: 20,
            color: '#94a3b8',
          }}
        >
          Trouve ton prochain film sur swipe-movie.com
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            fontSize: 22,
            color: '#ec4899',
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          🎬 SWIPE MOVIE
        </div>
      </div>
    </div>,
    { ...size },
  );
}
