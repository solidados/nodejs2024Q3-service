import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

import { PrismaService } from '../prisma/prisma.service';

import { User as PrismaUser } from '@prisma/client';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly NotFound = {
    status: 404,
    message: 'User not found',
    code: 'NOT_FOUND',
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: PrismaUser = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: createUserDto.password,
      },
    });

    return plainToInstance(User, user);
  }

  async findAll(): Promise<User[]> {
    const users: PrismaUser[] = await this.prisma.user.findMany();
    return users.map((user: PrismaUser) => plainToInstance(User, user));
  }

  async findOne(id: string): Promise<User> {
    const user: PrismaUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(this.NotFound);

    return plainToInstance(User, user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { oldPassword, newPassword, ...otherData } = updateUserDto;
    const user: PrismaUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(this.NotFound);

    if (oldPassword !== user.password)
      throw new ForbiddenException({
        message: 'Wrong password',
        code: 'WRONG_PASSWORD',
      });

    const updatedUser: PrismaUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...otherData,
        password: newPassword,
        version: { increment: 1 },
      },
    });

    return plainToInstance(User, updatedUser);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch {
      throw new NotFoundException(this.NotFound);
    }
  }
}
