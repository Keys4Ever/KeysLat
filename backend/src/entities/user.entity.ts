import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Url } from './url.entity';
import { Tag } from './tag.entity';
import * as bcrypt from 'bcrypt';


export enum AuthProvider {
  LOCAL = 'local',
  GITHUB = 'github',
  GOOGLE = 'google',
}

@Entity('users')
export class User {
  @PrimaryColumn()
  user_id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  profile_picture?: string;
  
  @Column({ nullable: true, unique: true })
  provider_id?: string;
  
  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL
  })
  auth_provider: AuthProvider;

  @OneToMany(() => Url, (url) => url.user)
  urls: Url[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  async validatePassword(plainPassword: string): Promise<boolean> {
    if (this.auth_provider !== AuthProvider.LOCAL || !this.password) {
      return false;
    }
    
    return await bcrypt.compare(plainPassword, this.password);
  }
}