import {
  Body,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Controller,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
    this.userService = userService;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): string {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(): string {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): string {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): string {
    return this.userService.delete(id);
  }
}
