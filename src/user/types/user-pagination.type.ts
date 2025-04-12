import { User } from '@prisma/client';
import { ResponseData } from 'src/common/types/response-data.type';

export type UserPagination = Omit<ResponseData<User>, 'password'>;
