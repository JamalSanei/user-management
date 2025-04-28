import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserCreateDto } from './dtos/user-create.dto';
import * as bcrypt from 'bcrypt';
import { UserUpdateDto } from './dtos/user-update.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/interfaces/pagination.interface';
import { UserPagination } from './types/user-pagination.type';
import { userPaginationSelectFields } from './selects/pagination-select';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UserService.name);

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
      this.logger.log(error);
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
      this.logger.log(error);
    }
  }

  async findOneById(id: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.log(error);
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
      this.logger.log(error);
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
      this.logger.log(error);
    }
  }
  // MID: define return type
  async hashPassword(password: string) {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      this.logger.log(error);
    }
  }

  async getAll(pagination: PaginationDto): Promise<UserPagination[] | []> {
    try {
      const result = await this.prisma.user.findMany({
        where: { isDeleted: false },
        skip: pagination.page * pagination.limit,
        take: pagination.limit,
        select: userPaginationSelectFields.select,
      });

      return result ? result : [];
    } catch (error) {
      this.logger.log(`[Error]: ${error} `);
      throw new HttpException(
        'internal service error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
