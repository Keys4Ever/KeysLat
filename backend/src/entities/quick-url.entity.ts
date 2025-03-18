import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Url } from './url.entity';

@Entity('quick_urls')
export class QuickUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  short_url: string;

  @Column()
  secret_key: string;

  @OneToOne(() => Url, (url) => url.quickUrl)
  @JoinColumn({ name: 'short_url', referencedColumnName: 'short_url' })
  url: Url;
}
