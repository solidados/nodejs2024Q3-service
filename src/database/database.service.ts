import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entitiy';

@Injectable()
export class DatabaseService {
  private users: User[] = [];

  addUser(user: User): User {
    this.users.push(user);
    return user;
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User {
    return this.users.find((user: User): boolean => user.id === id);
  }

  updateUser(user: User): User {
    const index: number = this.users.findIndex(
      (u: User): boolean => u.id === user.id,
    );
    this.users[index] = user;
    return user;
  }

  deleteUser(id: string): string {
    const index: number = this.users.findIndex((u: User) => u.id === id);
    this.users.splice(index, 1);
    return id;
  }
}
