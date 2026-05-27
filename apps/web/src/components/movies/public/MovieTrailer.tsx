import type { MovieVideo } from '@swipe-movie/types';

type Props = {
  videos?: MovieVideo[];
  title: string;
};

function pickTrailerKey(videos?: MovieVideo[]): string | null {
  if (!videos || videos.length === 0) return null;
  const official = videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official);
  const anyTrailer = videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const anyYoutube = videos.find((v) => v.site === 'YouTube');
  return (official ?? anyTrailer ?? anyYoutube)?.key ?? null;
}

export function MovieTrailer({ videos, title }: Props) {
  const key = pickTrailerKey(videos);
  if (!key) return null;

  // Use youtube-nocookie + srcdoc-less iframe. We accept loading the player on render
  // because trailer engagement is a key metric for the page and search engines
  // treat embedded video as enrichment.
  return (
    <section
      aria-labelledby="trailer-title"
      className="rounded-2xl border border-border/60 bg-card/40 p-6"
    >
      <h2 id="trailer-title" className="text-xl font-semibold mb-4">
        {title}
      </h2>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${key}?rel=0&modestbranding=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </section>
  );
}
