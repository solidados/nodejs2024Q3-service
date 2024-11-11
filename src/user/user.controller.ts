import {
  Body,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Controller,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entities/user.entity';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create User',
    description: 'create user (following DTO should be used) CreateUserDto',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description:
      'Server should answer with status code 201 and newly created record if request is valid',
  })
  @ApiResponse({
    status: 400,
    description:
      'Server should answer with status code 400 and corresponding message if request body does not contain required fields',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all Users' })
  @ApiResponse({
    status: 200,
    description:
      'Server should answer with status code 200 and all users records',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): User[] {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get Single User By ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description:
      'Server should answer with status code 200 and and record with id === userId if it exists',
  })
  @ApiResponse({
    status: 400,
    description:
      'Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 404,
    description:
      "Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist",
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string): User {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.delete(id);
  }
}
