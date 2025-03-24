import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlStats } from 'src/entities/url-stats.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(UrlStats)
        private readonly urlStatsRepository: Repository<UrlStats>,
    ) {}

    async getStatsOfUrl(urlId: number) {
        return await this.urlStatsRepository.find({
            where: {
                url_id: urlId
            }
        });
    }

    async updateClicks(url_id: number) {
        await this.urlStatsRepository.update({ url_id }, { clicks: () => 'clicks + 1' });
        await this.urlStatsRepository.update({ url_id }, { access_date: new Date() });
        return;
    }

    async createStats(url_id: number) {
        return await this.urlStatsRepository.save({
            url_id,
            clicks: 0,
            access_date: new Date()
        });
    }

    async deleteStats(url_id: number) {
        return await this.urlStatsRepository.delete({ url_id });
    }
}
