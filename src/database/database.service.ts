import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entitiy';

@Injectable()
export class DatabaseService {
  private users: User[] = [];

  addUser(user: User) {
    this.users.push(user);
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User {
    return this.users.find((usr: User): boolean => usr.id === id);
  }

  updateUser(user: User) {
    const index: number = this.users.findIndex(
      (usr: User): boolean => usr.id === user.id,
    );
    this.users[index] = user;
  }

  deleteUser(id: string) {
    const index: number = this.users.findIndex(
      (usr: User): boolean => usr.id === id,
    );
    this.users.splice(index, 1);
  }
}
