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

  constructor(private configService: ConfigService) {
    const isProduction = configService.get('NODE_ENV') === 'production';

    super({
      log: isProduction
        ? ['error', 'warn']
        : ['query', 'info', 'warn', 'error'],
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
      this.$connect();

      this.logger.log('Database connected successfully');

      // Log slow queries in development
      if (this.configService.get('NODE_ENV') !== 'production') {
        this.$on('query' as never, (e: any) => {
          if (e.duration > 1000) {
            // Log queries slower than 1 second
            this.logger.warn(
              `Slow query detected (${e.duration}ms): ${e.query}`,
            );
          }
        });
      }

      // Health check interval
      this.startHealthCheck();
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  /**
   * Periodic health check to ensure database connection is alive
   */
  private startHealthCheck() {
    setInterval(async () => {
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
      this.logger.log('Application shutting down, closing database connections');
      await this.$disconnect();
    });
  }
}
