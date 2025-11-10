import { IsNotEmpty, IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota' })
  @IsNotEmpty()
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Corolla' })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty({ example: 2023, minimum: 1900, maximum: 2100 })
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @ApiProperty({ example: 'ABC-1234', required: false })
  @IsOptional()
  @IsString()
  plateNumber?: string;

  @ApiProperty({ example: 'Blue', required: false })
  @IsOptional()
  @IsString()
  color?: string;
}
