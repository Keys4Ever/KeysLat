import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUrlDto } from 'src/dto/url.dto';
import { Tag } from 'src/entities/tag.entity';
import { Url } from 'src/entities/url.entity';
import { In, Repository } from 'typeorm';
import * as Randomstring from 'randomstring';
import { StatsService } from 'src/stats/stats.service';

@Injectable()
export class UrlService {
    constructor(
        @InjectRepository(Url)
        private readonly urlRepository: Repository<Url>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
        @InjectRepository(StatsService)
        private readonly statsService: StatsService
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
        if (urlDto.url_tags && urlDto.url_tags.length > 0) {
            tags = await this.tagRepository.find({
                where: { id: In(urlDto.url_tags) },
            });
            if (tags.length !== urlDto.url_tags.length) {
                throw new BadRequestException('Some tags do not exist');
            }
        }
        
        const newUrl = this.urlRepository.create({
            user_id: urlDto.user_id,
            original_url: urlDto.original_url,
            short_url: urlDto.short_url,
            description: urlDto.description,
            tags,
        });
        
        return this.urlRepository.save(newUrl).then(async (url) => {
            this.statsService.createStats(url.id)
            return url;
        });
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.urlRepository.delete({ id });
        return result.affected > 0;
    }

    async update(id: number, updateData: Partial<Url>): Promise<Url> {
        const url = await this.urlRepository.findOne({ where: { id } });
        if (!url) {
            throw new BadRequestException('URL not found');
        }

        if (updateData.original_url) {
            url.original_url = updateData.original_url;
        }
        if (updateData.short_url) {
            if (await this.alreadyExists(updateData.short_url)) {
                throw new BadRequestException('Short URL already exists');
            }
            url.short_url = updateData.short_url;
        }
        if (updateData.description !== undefined) {
            url.description = updateData.description;
        }
        if (updateData.tags) {
            url.tags = updateData.tags;
        }

        return this.urlRepository.save(url);
    }

    async getOnlyOriginalUrl(short_url: string): Promise<string | undefined> {
        await this.urlRepository.update({ short_url }, { stats: { clicks: () => 'clicks + 1' } });
        const url = await this.urlRepository.findOne({ where: { short_url } });
        return url?.original_url;
    }

    private generateShortUrl(): string {
        return Randomstring.generate({ length: 6, charset: 'alphanumeric' });   
    }

    async getOnlyId(short_url: string): Promise<number | undefined> {
        const url = await this.urlRepository.findOne({ where: { short_url } });
        return url?.id;
    }

    private async alreadyExists(short_url: string): Promise<boolean> {
        const url = await this.urlRepository.findOne({ where: { short_url } });
        return !!url;
    }

}
