// src/entities/url.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToOne,
    ManyToMany,
    JoinColumn,
    JoinTable,
  } from 'typeorm';
  import { User } from './user.entity';
import { QuickUrl } from './quick-url.entity';
import { UrlStats } from './url-stats.entity';
import { Tag } from './tag.entity';
  
  @Entity('urls')
  export class Url {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: true })
    user_id: string;
  
    @ManyToOne(() => User, (user) => user.urls, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({ unique: true })
    short_url: string;
  
    @Column('text')
    original_url: string;
  
    @Column('text', { nullable: true })
    description?: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
  
    @OneToOne(() => QuickUrl, (quickUrl) => quickUrl.url)
    quickUrl: QuickUrl;
  
    @OneToOne(() => UrlStats, (stats) => stats.url)
    stats: UrlStats;
  
    @ManyToMany(() => Tag, (tag) => tag.urls)
    @JoinTable({
      name: 'url_tags',
      joinColumn: { name: 'url_id', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
    })
    tags: Tag[];
  }
  