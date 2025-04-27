import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccessToken } from './types/access-token.type';
import { UserService } from 'src/user/user.service';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { User } from '@prisma/client';
import { ROLES } from 'src/common/enums/role-enum';
import { CurrentUser } from './types/current-user.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user: User | undefined | null =
      await this.usersService.findUserByUsername(username);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  async login(user: User): Promise<AccessToken> {
    const payload = { email: user.email, id: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(userData: RegisterRequestDto): Promise<AccessToken | void> {
    const existingUser = this.usersService.findUserByUsername(
      userData.username,
    );
    if (!existingUser) {
      throw new BadRequestException('email already exists');
    }

    userData.role = userData.role ?? ROLES.user;

    const userRegistered = await this.usersService.signup(userData);
    if (userRegistered) return this.login(userRegistered);
    else
      throw new HttpException(
        'process user registered have be error ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }

  async validateJwtUser(userId: string) {
    const user = await this.usersService.findOneById(userId);

    if (!user) throw new UnauthorizedException('user not found!');

    const currentUser: CurrentUser = { id: user.id, role: user.role };

    return currentUser;
  }
}
