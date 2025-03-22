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
  ],
  controllers: [UrlController],
  providers: [UrlService, TagsService],
})
export class AppModule {}
