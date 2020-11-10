import {
    Controller,
    Get,
    Param,
    NotFoundException,
    Post,
    Delete,
    UseGuards,
    HttpCode,
  } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { ResponseObject } from 'src/models/response.models';
import { ProfileResponse } from 'src/models/user.model';
  @Controller('profiles')
  export class ProfileController {
    constructor(private userService: UserService) {}

    @Get('/:id')
    @UseGuards(new OptionalAuthGuard())
    async findProfile(
      @User() user: UserEntity,
      @Param('id') id: string): Promise<ResponseObject<'profile', ProfileResponse>>  {
      const profile = await this.userService.findByUsername(id, user);
      if (!profile) {
        throw new NotFoundException();
      }
      return { profile };
    }

    @Post('/:id/send-friend-request')
    @HttpCode(200)
    @UseGuards(AuthGuard())
    async sendFriendReq(
      @User() user: UserEntity,
      @Param('id') id: string): Promise<ResponseObject<'profile', ProfileResponse>>  {
      const profile = await this.userService.sendFriendReq(user, id);
      return { profile };
    } 

    @Get('/:id/friend-request')
    @UseGuards(AuthGuard())
    async getFriendReq(
      @User() user: UserEntity,
      @Param('id') id: string): Promise<ResponseObject<'profile', ProfileResponse>>  {
      const profile = await this.userService.getFriendReq(user, id);
      return { profile }
    }


    
    @Post('/:id/accept-friend-request')
    @HttpCode(200)
    @UseGuards(AuthGuard())
    async acceptUser(
      @User() user: UserEntity,
      @Param('id') id: string): Promise<ResponseObject<'profile', ProfileResponse>>  
    {
      const profile = await this.userService.acceptUser(user, id);
      return { profile };
    }


  
    @Delete('/:id/unfriend')
    @UseGuards(AuthGuard())
    async unfriendUser(
      @User() user: UserEntity,
      @Param('id') id: string,
    ): Promise<ResponseObject<'profile', ProfileResponse>>  {
      const profile = await this.userService.unfriendUser(user, id);
      return { profile };
    }
  }