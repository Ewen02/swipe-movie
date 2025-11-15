export type TMDbMovie = {
  id: number;
  adult: boolean;
  title: string;
  backdrop_path: string | null;
  poster_path: string | null;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  popularity: number;
  release_date: string | null;
  overview: string | null;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type TMDbPopularResponse = {
  results: TMDbMovie[];
};

export type TMDbMovieGenreResponse = {
  id: number;
  name: string;
};

export type TMDbGenresResponse = {
  genres: TMDbMovieGenreResponse[];
};

export type TMDbDiscoverResponse = {
  page: number;
  results: TMDbMovie[];
  total_pages: number;
  total_results: number;
};

export type TMDbProductionCompany = {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
};

export type TMDbProductionCountry = {
  iso_3166_1: string;
  name: string;
};

export type TMDbSpokenLanguage = {
  iso_639_1: string;
  english_name: string;
  name: string;
};

export type TMDbVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
};

export type TMDbCastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

export type TMDbCrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

export type TMDbMovieDetailsResponse = {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: string | null;
  budget: number;
  genres: TMDbMovieGenreResponse[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: TMDbProductionCompany[];
  production_countries: TMDbProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: TMDbSpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  videos?: {
    results: TMDbVideo[];
  };
  credits?: {
    cast: TMDbCastMember[];
    crew: TMDbCrewMember[];
  };
};

export type TMDbWatchProvider = {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
};

export type TMDbWatchProvidersResult = {
  link?: string;
  flatrate?: TMDbWatchProvider[];
  rent?: TMDbWatchProvider[];
  buy?: TMDbWatchProvider[];
};

export type TMDbWatchProvidersResponse = {
  id: number;
  results: {
    [countryCode: string]: TMDbWatchProvidersResult;
  };
};
