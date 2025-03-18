import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Url } from './url.entity';

@Entity('url_stats')
export class UrlStats {
  @PrimaryColumn()
  url_id: number;

  @Column({ default: 0 })
  clicks: number;

  @Column({ type: 'timestamp' })
  access_date: Date;

  @OneToOne(() => Url, (url) => url.stats)
  @JoinColumn({ name: 'url_id' })
  url: Url;
}
