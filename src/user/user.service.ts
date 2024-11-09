import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto): string {
    return `Create new User`;
  }

  findAll(): string {
    return `Get All Users`;
  }

  findOne(id: number): string {
    return `Get User with id: ${id}`;
  }

  update(id: number, updateUserDto: UpdateUserDto): string {
    return `Update User with id: ${id}`;
  }

  delete(id: number): string {
    return `Delete User with id: ${id}`;
  }
}
