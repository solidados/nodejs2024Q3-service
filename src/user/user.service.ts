import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

import { PrismaService } from '../prisma/prisma.service';

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
    const existingUser = await this.prisma.user.findUnique({
      where: { login: createUserDto.login },
    });

    if (existingUser) {
      throw new ConflictException({
        status: 409,
        message: 'User with this login already exists',
        code: 'CONFLICT',
      });
    }

    const hashedPassword = await this.hash.getHash(createUserDto.password);

    const user = await this.prisma.user.create({
      data: {
        login: createUserDto.login,
        password: hashedPassword,
      },
    });

    return plainToInstance(User, user);
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
    return await this.prisma.user.findUnique({ where: { login } });
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

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
        version: { increment: 1 },
      },
    });

    return plainToInstance(User, updatedUser);
  }

  async delete(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(this.NotFound);

    await this.prisma.user.delete({ where: { id } });
  }

  async isExistLogin(login: string): Promise<boolean> {
    return !!(await this.findOneByLogin(login));
  }

  async isValidUser(login: string, password: string): Promise<User | null> {
    const user = await this.findOneByLogin(login);

    if (!user) return null;

    const isValidPassword: boolean = await this.hash.comparePasswords(
      password,
      user.password,
    );

    if (!isValidPassword) return null;

    // return isValidPassword;
    return plainToInstance(User, user);
  }
}
