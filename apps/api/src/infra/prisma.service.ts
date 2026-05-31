import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private healthCheckInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private configService: ConfigService) {
    const isProduction = configService.get('NODE_ENV') === 'production';
    const debugQueries = configService.get('DEBUG_QUERIES') === 'true';

    super({
      log: isProduction
        ? ['error', 'warn']
        : debugQueries
          ? ['query', 'info', 'warn', 'error']
          : ['warn', 'error'],
      errorFormat: isProduction ? 'minimal' : 'colorless',
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    this.logger.log('Connecting to database...');

    try {
      // Configure connection pool
      await this.$connect();

      this.logger.log('Database connected successfully');

      // Log slow queries in all environments
      this.$on('query' as never, (e: any) => {
        if (e.duration > 1000) {
          this.logger.warn(`Slow query detected (${e.duration}ms): ${e.query}`);
        }
      });

      // Periodic health check only makes sense for long-running processes.
      // In serverless (Vercel/Lambda) instances are frozen between requests
      // and Neon closes idle pooled connections, so the interval would just
      // fire against dead connections and log false-positive P1001 errors.
      if (!this.isServerless()) {
        this.startHealthCheck();
      }
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  /**
   * Detect serverless environments where a persistent health-check interval
   * is counterproductive. Vercel sets VERCEL=1 and AWS Lambda sets
   * AWS_LAMBDA_FUNCTION_NAME on every invocation.
   */
  private isServerless(): boolean {
    return (
      this.configService.get('VERCEL') === '1' ||
      !!this.configService.get('AWS_LAMBDA_FUNCTION_NAME')
    );
  }

  /**
   * Periodic health check to ensure database connection is alive
   */
  private startHealthCheck() {
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.$queryRaw`SELECT 1`;
      } catch (error) {
        this.logger.error('Database health check failed', error);
      }
    }, 60000); // Check every minute
  }

  /**
   * Graceful shutdown helper
   */
  async enableShutdownHooks() {
    process.on('beforeExit', async () => {
      this.logger.log(
        'Application shutting down, closing database connections',
      );
      await this.$disconnect();
    });
  }
}
