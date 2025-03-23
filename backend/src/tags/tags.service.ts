import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto, UpdateTagDto } from 'src/dto/tag.dto';
import { Tag } from 'src/entities/tag.entity';
import { Url } from 'src/entities/url.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
        @InjectRepository(Url)
        private readonly urlRepository: Repository<Url>
    ){}

    async createTag(createTagDto: CreateTagDto){ 
        const tag = this.tagRepository.create(createTagDto);
        return await this.tagRepository.save(tag);
    }

    async findAll(user_id: string){
        return await this.tagRepository.find({
            where: {
                user_id: user_id
            }
        });
    }

    async findByIds(ids: number[]): Promise<Tag[]> {
        return await this.tagRepository.find({
            where: { id: In(ids) }
        });
    }

    async findOne(id: number){
        return await this.tagRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async update(id: number, updateTagDto: UpdateTagDto){
        if(updateTagDto.name === updateTagDto.new_name && updateTagDto.description === updateTagDto.new_description || !updateTagDto.new_name && !updateTagDto.new_description){
            throw new BadRequestException('No changes detected');
        }

        return await this.tagRepository.update(id, updateTagDto);
    }

    async delete(id: number){
        return await this.tagRepository.delete(id);
    }

    async addTagToUrl(tagId: number, urlId: number) {
        const tag = await this.tagRepository.findOne({
            where: { id: tagId },
            relations: ['urls']
        });
        const url = await this.urlRepository.findOne({
            where: { id: urlId }
        });

        if (!tag || !url) {
            throw new Error('Tag or URL not found');
        }

        if (!tag.urls) {
            tag.urls = [];
        }
        
        tag.urls.push(url);
        return await this.tagRepository.save(tag);
    }
}
