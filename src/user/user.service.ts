import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UserCreateDto } from './dto/user-create.dto';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/user-login.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(newUser: UserCreateDto) {
    try {
      const hashPassword = await this.hashPassword(newUser.password);

      if (!!hashPassword) {
        newUser.password = hashPassword;
      } else {
        throw new HttpException(
          'generate password error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return await this.prisma.user.create({ data: newUser });
    } catch (error) {
      console.log(error);
    }
  }

  async signIn(data: UserLoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: data.username,
        },
      });

      if (user) {
        const isPasswordMatched = await bcrypt.compare(
          data.password,
          user.password,
        );

        if (isPasswordMatched) {
          // TODO: return jwt token
          return true;
        } else {
          throw new HttpException(
            'password not matched',
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async findUserByUsername(username: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          username,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getUsers() {
    try {
      return await this.prisma.user.findMany({
        where: {
          isDeleted: false,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser(userId: string, data: Partial<UserUpdateDto>) {
    try {
      if (data.password) data.password = await this.hashPassword(data.password);

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
  }
  // MID: define return type
  async deleteUser(userId: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          isDeleted: true,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
    }
  }
  // MID: define return type
  async hashPassword(password: string) {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      console.log(error);
    }
  }
}
