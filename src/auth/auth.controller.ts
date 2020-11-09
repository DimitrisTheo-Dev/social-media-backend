import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO, LoginDTO } from '../models/user.model';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async register(@Body(ValidationPipe) credentials: RegisterDTO) {
    const user = await this.authService.register(credentials);
    return { user };
  }

  @Post('/login')
  async login(@Body(ValidationPipe) credentials: LoginDTO) {
    const user = await this.authService.login(credentials);
    return { user };
  }
}