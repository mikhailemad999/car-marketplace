import { IsString, IsNotEmpty, IsNumber, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ListingStatus } from '../../entities/listing.entity';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @Type(() => Number)
  @IsInt()
  @Min(1900)
  year: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  mileage?: number;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  @IsString()
  sellerPhone?: string;

  @IsOptional()
  @IsString()
  certificateNumber?: string;

  @IsOptional()
  isCertified?: boolean;

  @IsOptional()
  @IsString()
  certificationType?: string;

  @IsOptional()
  @IsString()
  inspectionDate?: string;

  @IsOptional()
  @IsString()
  inspectorNotes?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  warranty?: string;

  @IsOptional()
  specs?: {
    engine?: string;
    horsepower?: number;
    acceleration?: string;
    topSpeed?: string;
    transmission?: string;
    drivetrain?: string;
    mileage?: number;
    vin?: string;
    hybridSystem?: string;
    downforce?: string;
  };

  @IsOptional()
  images?: Array<{ url: string; type?: string }>;
}

export class UpdateListingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  mileage?: number;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  @IsString()
  sellerPhone?: string;

  @IsOptional()
  @IsString()
  certificateNumber?: string;

  @IsOptional()
  isCertified?: boolean;

  @IsOptional()
  @IsString()
  certificationType?: string;

  @IsOptional()
  @IsString()
  inspectionDate?: string;

  @IsOptional()
  @IsString()
  inspectorNotes?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  warranty?: string;

  @IsOptional()
  status?: ListingStatus;

  @IsOptional()
  specs?: any;

  @IsOptional()
  images?: Array<{ url: string; type?: string }>;
}
