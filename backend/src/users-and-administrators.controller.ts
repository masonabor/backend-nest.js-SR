import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Headers,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { Administrator, User } from '@prisma/client';
import { AdministratorsService } from './administrators/administrators.service';
import { AuthService } from './authorization/authorization.service';
import { CreateUserDto, BanUserDto } from './dtos/user.dto';
import { AdminGuard } from './authorization/admin.guard';
import { Public } from './authorization/public.decorator';
import { CreateAdminDto } from './dtos/administrator.dto';

@Controller('users')
export class UsersAndAdministratorsController {
  constructor(
    private usersService: UsersService,
    private administratorsService: AdministratorsService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('createUser')
  async createUser(@Body() data: CreateUserDto) {
    return await this.usersService.createUser(data);
  }

  @Post('createAdmin')
  @UseGuards(AdminGuard)
  async createAdmin(@Body() data: CreateAdminDto) {
    return await this.administratorsService.createAdmin(data);
  }

  @Post('getUser')
  async getUser(@Headers('Authorization') authorization: string): Promise<User> {
    const token = authorization.replace('Bearer ', '');
    const decodedToken = this.authService.verifyToken(token);
    return this.usersService.getUserByEmail(decodedToken.email);
  }

  @Post('getAdmin')
  async getAdmin(@Headers('Authorization') authorization: string): Promise<Administrator> {
    const decodedToken = await this.authService.decodeHeader(authorization);
    return this.administratorsService.getAdminByEmail(decodedToken.email);
  }

  @Post('getAll')
  async getAllFromUser(@Headers('Authorization') authorization: string): Promise<User> {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization header must be provided in the format: Bearer <token>',
      );
    }

    const token = authorization.replace('Bearer ', '');
    try {
      const decodedToken = await this.authService.verifyToken(token);
      return await this.usersService.getUserWithAccountsAndDeposits(decodedToken.userId);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Get('getUserInfo/:id')
  @UseGuards(AdminGuard)
  async getUserInfo(@Param('id') id: string): Promise<User> {
    return await this.usersService.getUserWithAccountsAndDeposits(id);
  }

  @Get('getAllUsers')
  @UseGuards(AdminGuard)
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @Post('banUser')
  @UseGuards(AdminGuard)
  async banUser(@Body() data: BanUserDto): Promise<void> {
    await this.usersService.banUser(data.id, data.banReason);
  }
}
