import { UserRole } from '@prisma/client';

export type AccessTokenPayload = {
  email: string;
  id: string;

  role: UserRole[];
};

// email: 'jamal.sanei@gmail.com',
//   id: 'c1daf100-5e79-4cd7-ac4d-c744900551a1',
//   role: [ 'user' ],
