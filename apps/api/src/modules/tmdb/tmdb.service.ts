import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class TmdbService {
  private readonly baseUrl = process.env.TMDB_API_URL;
  private readonly apiKey = process.env.TMDB_API_KEY;

  async fetch(path: string, init?: RequestInit): Promise<Response> {
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      ...(init?.headers || {}),
    };

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers,
    });

    if (!res.ok) {
      throw new HttpException(
        `TMDb API error: status ${res.status} on path ${path}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    return res;
  }

  async fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await this.fetch(path, init);
    return (await res.json()) as T;
  }
}
