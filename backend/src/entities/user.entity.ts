import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Url } from './url.entity';
import { Tag } from './tag.entity';

@Entity('users')
export class User {
  @PrimaryColumn()
  user_id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  profile_picture?: string;

  @OneToMany(() => Url, (url) => url.user)
  urls: Url[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];
}