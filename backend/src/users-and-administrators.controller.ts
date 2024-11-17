import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { Administrator, User } from '@prisma/client';
import { AdministratorsService } from './administrators/administrators.service';
import { AuthService } from './authorization/authorization.service';
import { UserDto } from './dtos/UserDTO';
import { AdministratorDto } from './dtos/AdministratorDTO';

@Controller('users')
export class UsersAndAdministratorsController {

  constructor(private usersService: UsersService,
              private administratorsService: AdministratorsService,
              private authService: AuthService
  ) {}


  @Post('createUser')
  async createUser(@Body() data: UserDto) {
    return await this.usersService.createUser(data.user);
  }

  @Post('createAdmin')
  async createAdmin(@Body() data: AdministratorDto) {
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
      throw new UnauthorizedException('Authorization header must be provided in the format: Bearer <token>');
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
  async getUserInfo(@Headers('Authorization') authorization: string, @Param('id') id: string): Promise<User> {
    console.log(authorization, id);
    const admin = await this.authService.decodeHeader(authorization);

    if (!admin.isAdmin) {
      throw new UnauthorizedException('You are not authorized to access this page');
    }

    const user = await this.usersService.getUserWithAccountsAndDeposits(id);
    if (user) {
      return user;
    }

    throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
  }

  @Get('getAllUsers')
  async getAllUsers(@Headers('Authorization') authorization: string): Promise<User[]> {
    const admin = await this.authService.decodeHeader(authorization);
    if (!admin.isAdmin) {
      throw new UnauthorizedException('You are not authorized to access this resource');
    }
    return await this.usersService.getAllUsers();
  }


  @Post('banUser')
  async banUser(@Headers('Authorization') authorization: string, @Body() data: UserDto): Promise<void> {
    const admin = await this.authService.decodeHeader(authorization);

    if (!admin.isAdmin) {
      throw new UnauthorizedException('You are not an admin');
    }

    await this.usersService.banUser(data.user.id, data.user.banReason);
  }
}
