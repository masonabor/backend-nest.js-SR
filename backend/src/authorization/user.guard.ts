import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './authorization.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserGuard implements CanActivate {

  constructor(private readonly authService: AuthService,
              private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    try {
      request.user = await this.authService.decodeHeader(authorizationHeader); // Verify JWT token
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}