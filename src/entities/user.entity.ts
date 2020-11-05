import {
  Entity,
  Column,
  BeforeInsert,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude, classToPlain } from 'class-transformer';
import { IsEmail } from 'class-validator';

import { AbstractEntity } from './abstract-entity';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';
import { UserResponse } from 'src/models/user.model';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: null, nullable: true })
  image: string | null;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(
    type => UserEntity,
    user => user.friendRequests,
  )
  friendRequests: UserEntity[];

  @ManyToMany(
    type => UserEntity,
    user => user.friends,
  )
  friends: UserEntity[];

  @OneToMany(
    type => ArticleEntity,
    article => article.author,
  )
  articles: ArticleEntity[];

  @OneToMany(
    type => CommentEntity,
    comment => comment.author,
  )
  comments: CommentEntity[];

  @ManyToMany(
    type => ArticleEntity,
    article => article.favoritedBy,
  )
  favorites: ArticleEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  toJSON(): UserResponse {
    return <UserResponse>classToPlain(this);
  }

  toProfile(user?: UserEntity) {
    let areFriends = null;
    if (user) {
      areFriends = this.friends.includes(user);
    }
    const profile: any = this.toJSON();
    delete profile.friends;
    return { ...profile, areFriends };
  }
}