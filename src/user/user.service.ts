import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

import { PrismaService } from '../prisma/prisma.service';

// import { User as PrismaUser } from '@prisma/client';
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
    try {
      const timestamp = new Date();
      const user = await this.prisma.user.create({
        data: {
          // login: createUserDto.login,
          // password: createUserDto.password,
          ...createUserDto,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });

      return plainToInstance(User, {
        ...user,
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
      });
    } catch (error) {
      console.error('ERROR=', error);
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => plainToInstance(User, user));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(this.NotFound);

    return plainToInstance(User, user);
  }

  async findOneByLogin(login: string) {
    return this.prisma.user.findUnique({ where: { login } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(this.NotFound);

    if (updateUserDto.oldPassword !== user.password) {
      throw new ForbiddenException({
        message: 'Wrong password',
        code: 'WRONG_PASSWORD',
      });
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: updateUserDto.newPassword,
        version: { increment: 1 },
      },
    });

    // return plainToInstance(User, updatedUser);
    return plainToInstance(User, {
      ...updatedUser,
      updatedAt: updatedUser.updatedAt.getTime(),
      createdAt: updatedUser.createdAt.getTime(),
    });
  }

  async delete(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(this.NotFound);

    await this.prisma.user.delete({ where: { id } });
  }

  async isValidPassword(login: string, password: string): Promise<boolean> {
    const user = await this.findOneByLogin(login);
    return password === user.password;
  }
}
