import { Prisma } from '@prisma/client';

export const userPaginationSelectFields: Prisma.UserFindManyArgs = {
  select: {
    id: true,
    username: true,
    name: true,
    phone: true,
    email: true,
  },
};
