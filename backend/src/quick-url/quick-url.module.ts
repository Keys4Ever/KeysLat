import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuickUrl } from '../entities/quick-url.entity';
import { Url } from '../entities/url.entity';
import { QuickUrlService } from './quick-url.service';
import { UrlModule } from '../url/url.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuickUrl, Url]),
    UrlModule
  ],
  providers: [QuickUrlService],
  exports: [QuickUrlService]
})
export class QuickUrlModule {}