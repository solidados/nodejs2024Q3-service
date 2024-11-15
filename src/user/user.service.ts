import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly NotFound = {
    status: 404,
    message: 'Artist not found',
    code: 'NOT_FOUND',
  };

  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = await this.prismaService.user.create({
      data: {
        login: createUserDto.login,
        password: createUserDto.password,
      },
    });

    return plainToInstance(User, user);
  }

  async findAll(): Promise<User[]> {
    const users: User[] = await this.prismaService.user.findMany();
    return users.map((user: User) => plainToInstance(User, user));
  }

  async findOne(id: string): Promise<User> {
    const user: User = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(this.NotFound);

    return plainToInstance(User, user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { oldPassword, newPassword, ...otherData } = updateUserDto;
    const user: User = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(this.NotFound);

    if (oldPassword !== user.password)
      throw new ForbiddenException({
        message: 'Wrong password',
        code: 'WRONG_PASSWORD',
      });

    const updatedUser: User = this.prismaService.user.update({
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
      await this.prismaService.user.delete({ where: { id } });
    } catch {
      throw new NotFoundException(this.NotFound);
    }
  }
}
