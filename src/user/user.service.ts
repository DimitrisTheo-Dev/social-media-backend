import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'src/entities/user.entity';
import { ProfileResponse } from 'src/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async findByUsername(
    id: string,
    user?: UserEntity,
  ): Promise<ProfileResponse> {
    return (
      await this.userRepo.findOne({
        where: { id },
        relations: ['friends'],
      })
    ).toProfile(user);
  }
 


  async sendFriendReq(
    currentUser: UserEntity,
    id: string,
  ): Promise<ProfileResponse> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['friendRequests'],
    });
      user.friendRequests.push(currentUser);
      await user.save();
      return user.toProfile(currentUser);
  }

  async getFriendReq(
    currentUser: UserEntity,
    id: string,
  ) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['friendRequests'],
    });
    return user.toProfile(currentUser);
  }

  async acceptUser(
    currentUser: UserEntity,
    id: string,
  ): Promise<ProfileResponse> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['friends'],
    });
    user.friendRequests = user.friendRequests.filter(
      friend => friend !== currentUser,
    );
    user.friends.push(currentUser);
    await user.save();
    return user.toProfile(currentUser);
  }


  async unfriendUser(
    currentUser: UserEntity,
    id: string,
  ): Promise<ProfileResponse> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['friends'],
    });
    user.friends = user.friends.filter(
      friend => friend !== currentUser,
    );
    await user.save();
    return user.toProfile(currentUser);
  }
}
