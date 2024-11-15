import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AdministratorsService } from '../administrators/administrators.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private adminService: AdministratorsService,
  ) {}

  async login(email: string, password: string): Promise<{ access_token: string }> {

    const admin = await this.adminService.validateAdmin(email, password);
    const user = await this.usersService.validateUser(email, password);

    if (admin) {
      const payload = { adminId: admin.id, email: admin.email, isAdmin: true };
      return { access_token: this.jwtService.sign(payload) };
    }

    if (user) {
      const payload = { userId: user.id, email: user.email, isAdmin: false };
      return { access_token: this.jwtService.sign(payload) };
    }

    throw new UnauthorizedException('Invalid email or password');
  }


  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.SECRET
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Токен прострочений');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Токен не валідний');
      } else {
        throw new UnauthorizedException('Помилка верифікації токена');
      }
    }
  }

  async decodeHeader(header: string) {
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization header must be provided in the format: Bearer <token>',
      );
    }

    const token = header.replace('Bearer ', '');
    return this.verifyToken(token);
  }


}
