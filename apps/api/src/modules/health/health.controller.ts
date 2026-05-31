import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from '../../infra/prisma.service';

@ApiTags('Health')
@SkipThrottle()
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  async check() {
    const [database, tmdb] = await Promise.all([
      this.checkDatabase(),
      this.checkTmdb(),
    ]);

    const allOk = database === 'ok' && tmdb === 'ok';

    return {
      status: allOk ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      services: {
        database,
        tmdb,
      },
    };
  }

  private async checkDatabase(): Promise<string> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'ok';
    } catch {
      return 'error';
    }
  }

  private async checkTmdb(): Promise<string> {
    const apiKey = this.config.get<string>('TMDB_API_KEY');
    if (!apiKey) return 'not_configured';

    try {
      const res = await fetch('https://api.themoviedb.org/3/genre/movie/list', {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(5000),
      });
      return res.ok ? 'ok' : 'error';
    } catch {
      return 'error';
    }
  }
}
