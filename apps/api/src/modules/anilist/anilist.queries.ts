// GraphQL queries for AniList API

import { MediaStatus } from '../../common/constants/media';

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
export const ANILIST_STATUS_MAP: Record<string, MediaStatus> = {
  COMPLETED: MediaStatus.watched,
  WATCHING: MediaStatus.watchlist,
  PLANNING: MediaStatus.watchlist,
  PAUSED: MediaStatus.watchlist,
  DROPPED: MediaStatus.watched,
  REPEATING: MediaStatus.watched,
};
