import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlService } from '../url/url.service';
import { QuickUrl } from '../entities/quick-url.entity';
import { Repository } from 'typeorm';
import { Url } from '../entities/url.entity';
import * as crypto from 'crypto';
import { EntityManager } from 'typeorm';
import { correctResponse, incorrectResponse } from '../utils/buildResponse';
import { ApiResponse } from '../shared/interfaces/api.interface';

@Injectable()
export class QuickUrlService {
  constructor(
    @InjectRepository(QuickUrl)
    private readonly quickUrlRepository: Repository<QuickUrl>,
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    private readonly urlService: UrlService,
    private readonly entityManager: EntityManager
  ) {}

  async createQuickUrl(longUrl: string): Promise<ApiResponse<{ shortUrl: string; secretKey: string }>> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      try {
        const shortUrl = await this.generateUniqueShortUrl();
        
        const url = this.urlRepository.create({
          original_url: longUrl,
          short_url: shortUrl,
          user_id: null
        });

        await transactionalEntityManager.save(url);
        
        const secretKey = crypto.randomBytes(64).toString('hex');
        
        const quickUrl = this.quickUrlRepository.create({
          short_url: shortUrl,
          secret_key: secretKey,
          url: url
        });

        await transactionalEntityManager.save(quickUrl);

        return correctResponse('Quick URL created successfully', {
          shortUrl: shortUrl,
          secretKey: secretKey
        });
      } catch (error) {
        throw new BadRequestException('Error creating quick URL');
      }
    });
  }

  async connectQuickUrl(userId: string, secretKey: string): Promise<ApiResponse<any>> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      try {
        const quickUrl = await transactionalEntityManager
          .createQueryBuilder(QuickUrl, 'quick')
          .innerJoinAndSelect('quick.url', 'url')
          .where('quick.secret_key = :secretKey', { secretKey })
          .getOne();

        if (!quickUrl) {
          return incorrectResponse('Invalid secret key');
        }

        await transactionalEntityManager
          .createQueryBuilder()
          .update(Url)
          .set({ user_id: userId })
          .where('id = :urlId', { urlId: quickUrl.url.id })
          .execute();

        await transactionalEntityManager.remove(quickUrl);

        return correctResponse('URL successfully linked to account', {
          shortUrl: quickUrl.short_url,
          originalUrl: quickUrl.url.original_url,
          linkedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error linking URL:', error);
        return incorrectResponse('Error linking URL to account');
      }
    });
  }

  private async generateUniqueShortUrl(): Promise<string> {
    return Randomstring.generate({
        length: 6,
        charset: 'alphanumeric',
        capitalization: 'lowercase'
    })
  }
}