import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants/meta-data-keys.constant';
import { ROLES } from '../enums/role-enum';

export const Roles = (...roles: [ROLES, ...ROLES[]]) =>
  SetMetadata(ROLES_KEY, roles);
