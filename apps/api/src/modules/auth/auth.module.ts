import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { EmailHeaderStrategy } from './email-header.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h',
          issuer: 'swipe-movie-api',
          audience: 'swipe-movie-web',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, EmailHeaderStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
