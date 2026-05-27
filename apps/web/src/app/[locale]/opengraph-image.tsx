import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Swipe Movie — Find your next movie with friends';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const COPY: Record<string, { tagline: string; sub: string }> = {
  fr: {
    tagline: 'Trouvez votre prochain film entre amis',
    sub: 'Créez une room. Swipez. Matchez.',
  },
  en: {
    tagline: 'Find your next movie with friends',
    sub: 'Create a room. Swipe. Match.',
  },
  es: {
    tagline: 'Encuentra tu próxima película con amigos',
    sub: 'Abre una sala. Desliza. Haz match.',
  },
  de: {
    tagline: 'Finde deinen nächsten Film mit Freunden',
    sub: 'Erstelle einen Raum. Swipe. Matche.',
  },
  it: {
    tagline: 'Trova il tuo prossimo film con gli amici',
    sub: 'Apri una room. Swippa. Matcha.',
  },
};

export default async function OpenGraphImage({ params }: { params: { locale: string } }) {
  const t = COPY[params.locale] ?? COPY.fr!;

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 45%, #0a0a1a 100%)',
        color: 'white',
        padding: '80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: -150,
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, #ec489966 0%, transparent 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -200,
          right: -150,
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, #8b5cf666 0%, transparent 70%)',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
          }}
        >
          🎬
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: -2,
          }}
        >
          Swipe Movie
        </div>
      </div>

      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          lineHeight: 1.05,
          textAlign: 'center',
          backgroundImage: 'linear-gradient(90deg, #ec4899, #8b5cf6)',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: 28,
          maxWidth: 1000,
        }}
      >
        {t.tagline}
      </div>

      <div
        style={{
          fontSize: 32,
          color: '#cbd5e1',
          textAlign: 'center',
          maxWidth: 900,
        }}
      >
        {t.sub}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 40,
          fontSize: 24,
          color: '#94a3b8',
        }}
      >
        swipe-movie.com
      </div>
    </div>,
    { ...size },
  );
}
