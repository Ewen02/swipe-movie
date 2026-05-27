import { ImageResponse } from 'next/og';
import { parseMovieSlug } from '@/lib/slug';
import { getPublicMovieDetails } from '@/lib/movies-public';

export const runtime = 'nodejs';
export const alt = 'Swipe Movie';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Params = { locale: string; slug: string };

export default async function SerieOg({ params }: { params: Params }) {
  const parsed = parseMovieSlug(params.slug);
  const movie = parsed ? await getPublicMovieDetails(parsed.id, params.locale, 'tv') : null;

  const title = movie?.title ?? 'Swipe Movie';
  const year = movie?.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;
  const rating = movie && movie.voteAverage > 0 ? movie.voteAverage.toFixed(1) : null;
  const TAGLINES: Record<string, string> = {
    fr: 'Trouvez votre prochaine série entre amis',
    en: 'Find your next series with friends',
    es: 'Encuentra tu próxima serie con amigos',
    de: 'Finde deine nächste Serie mit Freunden',
    it: 'Trova la tua prossima serie con gli amici',
  };
  const tagline = TAGLINES[params.locale] ?? TAGLINES.fr;

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #0a0a1a 45%, #1a0a1a 100%)',
        color: 'white',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: -150,
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, #8b5cf666 0%, transparent 70%)',
        }}
      />
      {/* next/og's ImageResponse only supports native <img>; next/image is unsupported here. */}
      {movie?.posterUrl ? (
        <img
          src={movie.posterUrl}
          alt=""
          width={360}
          height={540}
          style={{
            width: 360,
            height: 540,
            borderRadius: 24,
            objectFit: 'cover',
            margin: 45,
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
          }}
        />
      ) : null}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 60px 60px 20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            color: '#8b5cf6',
            fontWeight: 700,
            letterSpacing: 2,
            marginBottom: 16,
          }}
        >
          📺 SWIPE MOVIE
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: 16,
            backgroundImage: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {title}
        </div>
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
        </div>
        <div style={{ fontSize: 26, color: '#e2e8f0', maxWidth: 600 }}>{tagline}</div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            fontSize: 22,
            color: '#94a3b8',
          }}
        >
          swipe-movie.com
        </div>
      </div>
    </div>,
    { ...size },
  );
}
