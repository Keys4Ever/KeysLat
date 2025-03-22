import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { Url } from './url.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, (user) => user.tags)
  user: User;

  @ManyToMany(() => Url, (url) => url.tags)
  urls: Url[];
}
