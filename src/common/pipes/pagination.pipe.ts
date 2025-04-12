import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { PaginationDto } from '../interfaces/pagination.interface';

export class PaginationPipe implements PipeTransform {
  public transform(value: PaginationDto): PaginationDto {
    if (!value.page || value.page == 1) value.page = 0;
    if (!value.limit) value.limit = 20;

    return value;
  }
}
