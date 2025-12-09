// Match data shape
export interface MatchData {
  id: string;
  roomId: string;
  movieId: string;
  createdAt: Date;
}

// Match with movie details
export interface MatchWithMovie {
  id: string;
  roomId: string;
  movieId: string;
  movie: {
    id: number;
    title: string;
    posterPath?: string | null;
    releaseDate: string;
    voteAverage: number;
  };
  createdAt: Date;
}
