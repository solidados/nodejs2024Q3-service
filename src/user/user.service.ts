import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { DatabaseService } from '../database/database.service';
import { User } from './entities/user.entitiy';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  create(createUserDto: CreateUserDto): User {
    const user: User = new User(createUserDto.login, createUserDto.password);
    this.databaseService.addUser(user);

    return plainToClass(User, user);
  }

  findAll(): User[] {
    return this.databaseService.getUsers();
  }

  findOne(id: string): User {
    const user: User = this.databaseService.getUserById(id);

    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    return plainToClass(User, user);
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const user: User = this.databaseService.getUserById(id);

    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    if (updateUserDto.oldPassword !== user.password) {
      throw new ForbiddenException({ message: 'Wrong password' });
    }

    user.version += 0.1;
    user.password = updateUserDto.newPassword;
    user.updatedAt = Date.now();
    this.databaseService.updateUser(user);

    return plainToClass(User, user);
  }

  delete(id: string): void {
    const user: User = this.databaseService.getUserById(id);

    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }
    return this.databaseService.deleteUser(id);
  }
}
