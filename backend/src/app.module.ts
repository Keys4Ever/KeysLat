import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/orm-config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UrlController } from './url/url.controller';
import { UrlService } from './url/url.service';
import { UrlModule } from './url/url.module';
import { TagsService } from './tags/tags.service';
import { TagsModule } from './tags/tags.module';
import { RedisModule } from './redis/redis.module';
import { StatsModule } from './stats/stats.module';
import { QuickUrlModule } from './quick-url/quick-url.module';
import { QuickUrlService } from './quick-url/quick-url.service';
import { QuickUrlModule } from './quick-url/quick-url.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    AuthModule,
    UsersModule,
    UrlModule,
    TagsModule,
    RedisModule,
    StatsModule,
    QuickUrlModule,
  ],
  controllers: [UrlController],
  providers: [UrlService, TagsService, QuickUrlService],
})
export class AppModule {}
