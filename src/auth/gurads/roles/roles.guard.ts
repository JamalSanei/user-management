import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/constants/meta-data-keys.constant';
import { ROLES } from 'src/common/enums/role-enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ROLES[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const user = context.switchToHttp().getRequest().user;

    const hasRequiredRole = requiredRoles.some((role) =>
      user.roles.some((userRole) => userRole === role),
    );

    if (!hasRequiredRole)
      throw new ForbiddenException(
        'Access denied: You do not have the required role.',
      );
    return hasRequiredRole;
  }
}
