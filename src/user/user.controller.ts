import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/auth/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO } from 'src/models/user.model';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard())
  async findCurrentUser(@User() { id }: UserEntity) {
    const user = await this.authService.findCurrentUser(id);
    return { user };
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(
    @User() { id }: UserEntity,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: UpdateUserDTO,
  ){
    const user = await this.authService.updateUser(id, data);
    return { user };
  }
}