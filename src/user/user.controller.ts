import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() data: UserCreateDto) {
    try {
      return await this.userService.signup(data);
    } catch (error) {
      console.log(error);
    }
  }

  @Patch('/:id')
  async updateUser(@Param('id') userId: string, @Body() data: UserUpdateDto) {
    try {
      return await this.userService.updateUser(userId, data);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('login')
  async login(@Body() data: UserLoginDto) {
    try {
      return await this.userService.signIn(data);
    } catch (error) {
      console.log(error);
    }
  }

  @Delete('/:id')
  async deleteUser(@Param('id') userId: string) {
    try {
      return await this.userService.deleteUser(userId);
    } catch (error) {
      console.log(error);
    }
  }
}
