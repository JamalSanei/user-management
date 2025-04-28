import { UserRole } from '@prisma/client';
// import { ROLES } from 'src/common/enums/role-enum';

export type CurrentUser = {
  id: string;
  roles: UserRole[];
};
