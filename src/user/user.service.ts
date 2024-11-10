import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

    return user;
  }

  findAll(): User[] {
    return this.databaseService.getUsers();
  }

  findOne(id: string): User {
    const user: User = this.databaseService.getUserById(id);

    if (user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const user: User = this.databaseService.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.oldPassword !== user.password) {
      throw new ForbiddenException('Wrong password');
    }

    user.version += 0.1;
    user.updatedAt = Date.now();
    user.password = updateUserDto.newPassword;
    this.databaseService.updateUser(user);

    return user;
  }

  delete(id: string) {
    const user: User = this.databaseService.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.databaseService.deleteUser(id);
  }
}
