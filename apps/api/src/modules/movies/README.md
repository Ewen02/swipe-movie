# Movies Module - API Provider Abstraction

## Overview

The Movies module uses a pluggable architecture that allows switching between different movie data providers (TMDB, OMDb, etc.) without code changes.

## Supported Providers

### TMDB (The Movie Database) - Default
- **Cost**: Free (non-commercial) or $149/month (commercial)
- **Status**: ✅ Fully implemented
- **Data Quality**: Excellent (comprehensive metadata, high-quality images)
- **Use For**: Phase 1 (free beta), Phase 2+ (commercial)

### OMDb (Open Movie Database)
- **Cost**: $1-10/month
- **Status**: ⚠️ Skeleton only (Phase 2 implementation)
- **Data Quality**: Good (basic metadata, posters)
- **Use For**: Cost-effective alternative in growth phase

## Configuration

### Environment Variable

Set the provider in your `.env` file:

```bash
# Use TMDB (default)
MOVIE_API_PROVIDER=tmdb
TMDB_API_KEY=your_tmdb_api_key

# Use OMDb (Phase 2)
MOVIE_API_PROVIDER=omdb
OMDB_API_KEY=your_omdb_api_key
```

### Switching Providers

**To switch from TMDB to OMDb:**

1. Update `.env`:
   ```bash
   MOVIE_API_PROVIDER=omdb
   OMDB_API_KEY=your_key_here
   ```

2. Restart the application:
   ```bash
   npm run start:dev
   ```

3. Verify the switch:
   ```bash
   # Check logs for: "Using movie provider: omdb"
   ```

**That's it!** No code changes required.

## Architecture

```
MoviesModule
├── IMovieProvider (interface)
│   ├── discover()
│   ├── getDetails()
│   ├── search()
│   ├── getGenres()
│   └── getWatchProviders()
│
├── Providers
│   ├── TMDBProvider (implements IMovieProvider)
│   └── OMDbProvider (implements IMovieProvider)
│
└── Factory Pattern
    └── Selects provider based on MOVIE_API_PROVIDER env var
```

## Interface: IMovieProvider

All providers must implement these methods:

```typescript
interface IMovieProvider {
  discover(params: DiscoverParams): Promise<DiscoverResponse>;
  getDetails(id: string, type: 'movie' | 'tv'): Promise<MovieDetailsDto>;
  search(query: string, type: 'movie' | 'tv', page?: number): Promise<DiscoverResponse>;
  getGenres(type: 'movie' | 'tv'): Promise<MoviesGenresDto[]>;
  getWatchProviders?(id: string, type: 'movie' | 'tv', region: string): Promise<any>;
}
```

## Adding a New Provider

1. Create new provider file:
   ```typescript
   // providers/newprovider.provider.ts
   @Injectable()
   export class NewProvider implements IMovieProvider {
     // Implement all interface methods
   }
   ```

2. Register in `movies.module.ts`:
   ```typescript
   providers: [
     // ...
     NewProvider,
   ],
   ```

3. Add to factory switch:
   ```typescript
   case 'newprovider':
     return newProvider;
   ```

4. Update `.env.example`:
   ```bash
   MOVIE_API_PROVIDER=newprovider
   NEWPROVIDER_API_KEY=your_key
   ```

## Testing

### Unit Tests

```bash
# Test TMDB provider
npm run test -- tmdb.provider

# Test OMDb provider (Phase 2)
npm run test -- omdb.provider
```

### Integration Tests

```bash
# Test with TMDB
MOVIE_API_PROVIDER=tmdb npm run test:e2e

# Test with OMDb (Phase 2)
MOVIE_API_PROVIDER=omdb npm run test:e2e
```

## Provider Comparison

| Feature | TMDB | OMDb | Notes |
|---------|------|------|-------|
| **Cost (Free)** | ✅ Non-commercial only | ✅ 1K req/day | Limited |
| **Cost (Paid)** | $149/month | $10/month | 93% savings with OMDb |
| **Data Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | TMDB more comprehensive |
| **Images** | High quality, multiple sizes | Single poster | TMDB better |
| **Metadata** | Extensive (cast, crew, etc.) | Basic | TMDB better |
| **Trailers** | ✅ Yes | ❌ No | TMDB only |
| **Streaming** | ✅ Yes (JustWatch data) | ❌ No | TMDB only |
| **Genre Discovery** | ✅ Native support | ⚠️ Workaround needed | TMDB better |
| **API Stability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Both good |
| **Rate Limits** | ~40 req/sec | Varies by plan | TMDB more generous |

## Migration Strategy

See [ROADMAP_SAAS.md](../../../../../ROADMAP_SAAS.md) for detailed migration plan.

**Summary:**
- **Phase 1**: Use TMDB free (beta, no monetization)
- **Phase 2 Option A**: Pay TMDB $149/month (best quality)
- **Phase 2 Option B**: Migrate to OMDb $10/month (cost savings)
- **Phase 3**: Evaluate based on revenue and user feedback

## Rollback Plan

If provider switch causes issues:

1. Stop the application
2. Revert `.env`:
   ```bash
   MOVIE_API_PROVIDER=tmdb
   ```
3. Restart application
4. Check logs for successful rollback

## Monitoring

Monitor provider performance:

```typescript
// Add logging in movies.service.ts
this.logger.log(`Using provider: ${process.env.MOVIE_API_PROVIDER}`);

// Track API response times
// Track error rates by provider
// Compare data quality metrics
```

## FAQ

**Q: Can I use multiple providers simultaneously?**
A: Not currently. The factory pattern selects one provider at runtime.

**Q: What happens if I switch providers mid-operation?**
A: Changes take effect after application restart. Existing operations continue with the old provider.

**Q: Do I need to migrate data when switching providers?**
A: No. Movie IDs and data are fetched fresh from the new provider.

**Q: What about caching?**
A: Cache is provider-agnostic. Keys include provider name to avoid collisions.

**Q: Can I A/B test providers?**
A: Yes, but requires code changes (route % of traffic to each provider).

## Resources

- [TMDB API Docs](https://developer.themoviedb.org/)
- [OMDb API Docs](https://www.omdbapi.com/)
- [ROADMAP_SAAS.md](../../../../../ROADMAP_SAAS.md)
- [.clauderc](./../../../../../.clauderc) - Project code standards
