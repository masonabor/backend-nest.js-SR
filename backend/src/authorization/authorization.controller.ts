import { Body, Controller, Get, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './authorization.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Get('profile')
  async get(@Headers('Authorization') authorization: string) {
    return this.authService.decodeHeader(authorization);
  }
}
