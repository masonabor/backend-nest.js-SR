import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './authorization.service';
import { Public } from './public.decorator';
import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data.email, data.password);
  }

  @Get('profile')
  async get(@Headers('Authorization') authorization: string) {
    return this.authService.decodeHeader(authorization);
  }
}
