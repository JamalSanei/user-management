import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { PaginationDto } from 'src/common/interfaces/pagination.interface';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROLES } from 'src/common/enums/role-enum';
import { RolesGuard } from 'src/auth/gurads/roles/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(ROLES.admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUsers(
    @Query(PaginationPipe) paginationDto: PaginationDto,
    @Request() req: any,
  ) {
    try {
      console.log(req.user);
      return await this.userService.getAll(paginationDto);
    } catch (error) {
      console.log(error);
      throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
