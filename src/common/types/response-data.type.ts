export type ResponseData<T> = Omit<T, 'isDeleted' | 'createdAt' | 'updatedAt'>;
