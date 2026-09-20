import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  listingId: number;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
