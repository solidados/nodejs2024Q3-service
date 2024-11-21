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
import { HashService } from '../hash/hash.service';

@Injectable()
export class UserService {
  private readonly NotFound = {
    status: 404,
    message: 'User not found',
    code: 'NOT_FOUND',
  };

  private readonly Forbidden = {
    status: 403,
    message: 'Wrong password, or passwords not equal',
    code: 'NOT_EQUAL',
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly hash: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const timestamp: Date = new Date();
      const hashedPassword = await this.hash.getHash(createUserDto.password);
      const user = await this.prisma.user.create({
        data: {
          login: createUserDto.login,
          password: hashedPassword,
          // ...createUserDto,
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

    const isPasswordsEqual: boolean = await this.hash.comparePasswords(
      updateUserDto.oldPassword,
      user.password,
    );

    if (!isPasswordsEqual) throw new ForbiddenException(this.Forbidden);

    const hashedNewPassword: string = await this.hash.getHash(
      updateUserDto.newPassword,
    );

    // if (updateUserDto.oldPassword !== user.password)
    //   throw new ForbiddenException(this.Forbidden);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
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

  async isExistLogin(login: string): Promise<boolean> {
    return Boolean(await this.findOneByLogin(login));
  }

  async isValidPassword(login: string, password: string): Promise<boolean> {
    const user = await this.findOneByLogin(login);
    return password === user.password;
  }

  async isValidUser(login: string, password: string): Promise<boolean | null> {
    const user = await this.findOneByLogin(login);
    const isValidPassword: boolean = await this.hash.comparePasswords(
      password,
      user.password,
    );

    if (!user) return null;
    if (!isValidPassword) return null;

    return isValidPassword;
  }
}
