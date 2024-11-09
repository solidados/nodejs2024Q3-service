import { Injectable } from '@nestjs/common';
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
    return this.databaseService.addUser(
      new User(createUserDto.login, createUserDto.password),
    );
  }

  findAll(): User[] {
    return this.databaseService.getUsers();
  }

  findOne(id: string): User {
    return this.databaseService.getUserById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    return this.databaseService.updateUser(
      new User(updateUserDto.login, updateUserDto.password),
    );
  }

  delete(id: string): string {
    return this.databaseService.deleteUser(id);
  }
}
