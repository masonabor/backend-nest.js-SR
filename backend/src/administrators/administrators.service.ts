import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Administrator } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdministratorsService {

  constructor(private prisma: PrismaService) {
  }

  async createAdmin(data: Prisma.AdministratorCreateInput): Promise<Administrator> {

    if (! (await this.getAdminByEmail(data.email))) {
      throw new NotFoundException('Email already exists');
    }

    return this.prisma.administrator.create({
      data: {
        email: data.email,
        password: await bcrypt.hash(data.password, 10),
      }
    });
  }

  async updateAdmin(params: {
    where: Prisma.AdministratorWhereUniqueInput;
    data: Prisma.AdministratorUpdateInput;
  }): Promise<Administrator> {
    const { where, data } = params;
    return this.prisma.administrator.update({
      data,
      where,
    });
  }

  async validateAdmin(email: string, password: string): Promise<Administrator | null> {
    const admin = await this.prisma.administrator.findUnique({
      where: { email }
    });

    if (!admin) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    return isPasswordValid ? admin : null;
  }

  async getAdminById(id: number): Promise<Administrator | null> {
    const admin = await this.prisma.administrator.findUnique({
      where: {id}
    })
    return admin ? admin : null;
  }

  async getAdminByEmail(email: string): Promise<Administrator | null> {
    const admin = await this.prisma.administrator.findUnique({
      where: {email}
    });
    return admin ? admin : null;
  }
}