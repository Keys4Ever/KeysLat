import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUrlDto } from 'src/dto/url.dto';
import { Tag } from 'src/entities/tag.entity';
import { Url } from 'src/entities/url.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class UrlService {
    constructor(
        @InjectRepository(Url)
        private readonly urlRepository: Repository<Url>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) {}


    async getOne(id: number): Promise<Url | undefined> {
        return this.urlRepository.findOne({ where: { id } });
    }

    async findAll(userId: string): Promise<Url[]> {
        return this.urlRepository.find({ where: { user_id: userId } });
    }

    async create(urlDto: CreateUrlDto): Promise<Url> {
        if (urlDto.short_url && (await this.alreadyExists(urlDto.short_url))) {
          throw new BadRequestException('Short URL already exists');
        }
    
        if (!urlDto.short_url) {
          do {
            const short_url = this.generateShortUrl();
            urlDto.short_url = short_url;
          } while (await this.alreadyExists(urlDto.short_url));
        }
    
        let tags: Tag[] = [];
        // Maybe a for cicle and log the tags that doesnt exist ??
        if (urlDto.url_tags && urlDto.url_tags.length > 0) {
          tags = await this.tagRepository.find({
            where: { id: In(urlDto.url_tags) },
          });
          if (tags.length !== urlDto.url_tags.length) {
            throw new BadRequestException('Algunos tags no existen');
          }
        }
    
        const newUrl = this.urlRepository.create({
          user_id: urlDto.user_id,
          original_url: urlDto.original_url,
          short_url: urlDto.short_url,
          description: urlDto.description,
          tags,
        });
    
        return this.urlRepository.save(newUrl);
      }

    async delete(id: number): Promise<void> {
        await this.urlRepository.delete({ id });
    }

    async update(id: number, updateData: Partial<Url>): Promise<Url> {
        await this.urlRepository.update(id, updateData);
        return this.urlRepository.findOne({ where: { id } });
    }

    async getOnlyOriginalUrl(short_url: string): Promise<string | undefined> {
        await this.urlRepository.update({ short_url }, { stats: { clicks: () => 'clicks + 1' } });

        const { original_url } = await this.urlRepository.findOne({ where: { short_url } });
        return original_url;
    }

    generateShortUrl(): string {
        return Randomstring.generate({ length: 6, charset: 'alphanumeric' });   
    }

    private async alreadyExists(short_url: string): Promise<boolean> {
        const url = await this.urlRepository.findOne({ where: { short_url } });
        return !!url;
    }
}
