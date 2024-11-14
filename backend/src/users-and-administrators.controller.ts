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

@Controller('users')
export class UsersAndAdministratorsController {

  constructor(private usersService: UsersService,
              private administratorsService: AdministratorsService,
              private authService: AuthService
  ) {}


  @Post('createUser')
  async createUser(@Body() data: UserDto) {
    return await this.usersService.createUser(data);
  }

  @Post('getUser')
  async getUser(@Headers('Authorization') authorization: string): Promise<User> {
    const token = authorization.replace('Bearer ', '');
    const decodedToken = this.authService.verifyToken(token);
    return this.usersService.getUserByEmail(decodedToken.email);
  }

  @Post('getAll')
  async getAllFromUser(@Headers('Authorization') authorization: string): Promise<User> {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header must be provided in the format: Bearer <token>');
    }

    const token = authorization.replace('Bearer ', '');
    try {
      const decodedToken = await this.authService.verifyToken(token);
      return await this.usersService.getUserWithAccountsAndDeposits(decodedToken.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
  // @Get(':id')
  // async getUser(@Param('id') id: number): Promise<User | Administrator> {
  //   const user = await this.usersService.getUserById(id);
  //   if (user) {
  //     return user;
  //   }
  //
  //   const admin = await this.administratorsService.getAdminById(id);
  //   if (admin) {
  //     return admin;
  //   }
  //
  //   throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
  // }

  @Get('getAllUsers')
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
}
