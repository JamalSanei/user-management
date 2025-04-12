import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { PaginationDto } from 'src/common/interfaces/pagination.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUsers(@Query(PaginationPipe) paginationDto: PaginationDto) {
    try {
      return await this.userService.getAll(paginationDto);
    } catch (error) {
      console.log(error);
      throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
