// GraphQL queries for AniList API

export const GET_CURRENT_USER = `
  query {
    Viewer {
      id
      name
      avatar {
        medium
        large
      }
    }
  }
`;

export const GET_USER_ANIME_LIST = `
  query ($userId: Int) {
    MediaListCollection(userId: $userId, type: ANIME) {
      lists {
        name
        status
        entries {
          id
          mediaId
          status
          score(format: POINT_10)
          progress
          completedAt {
            year
            month
            day
          }
          media {
            id
            idMal
            title {
              romaji
              english
              native
            }
            format
            status
            episodes
            averageScore
          }
        }
      }
    }
  }
`;

export const GET_USER_MANGA_LIST = `
  query ($userId: Int) {
    MediaListCollection(userId: $userId, type: MANGA) {
      lists {
        name
        status
        entries {
          id
          mediaId
          status
          score(format: POINT_10)
          progress
          completedAt {
            year
            month
            day
          }
          media {
            id
            idMal
            title {
              romaji
              english
              native
            }
            format
            status
            chapters
            averageScore
          }
        }
      }
    }
  }
`;

// AniList status to our status mapping
export const ANILIST_STATUS_MAP: Record<string, string> = {
  COMPLETED: 'watched',
  WATCHING: 'watchlist',
  PLANNING: 'watchlist',
  PAUSED: 'watchlist',
  DROPPED: 'watched',
  REPEATING: 'watched',
};
