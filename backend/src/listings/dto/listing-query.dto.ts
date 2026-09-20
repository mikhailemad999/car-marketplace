import { IsOptional, IsString, IsNumber, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ListingStatus } from '../../entities/listing.entity';

export class ListingQueryDto {
  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  year?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  status?: ListingStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  page?: number = 1;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sortBy?: 'price' | 'year' | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
