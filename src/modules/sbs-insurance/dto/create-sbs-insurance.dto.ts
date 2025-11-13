import { IsNotEmpty, IsString, IsInt, IsOptional, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSbsInsuranceDto {
  @ApiProperty({ 
    description: 'Plate number (required)',
    example: 'ABC-1234',
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  plateNumber: string;

  @ApiPropertyOptional({ 
    description: 'Number of SOAT accidents',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  soatAccidents?: number;

  @ApiPropertyOptional({ 
    description: 'SOAT table details',
    example: 'Details of SOAT accidents',
  })
  @IsOptional()
  @IsString()
  soatTableDetails?: string;

  @ApiPropertyOptional({ 
    description: 'Number of insurance accidents',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  insuranceAccidents?: number;

  @ApiPropertyOptional({ 
    description: 'Insurance table details',
    example: 'Details of insurance accidents',
  })
  @IsOptional()
  @IsString()
  insuranceTableDetails?: string;

  @ApiPropertyOptional({ 
    description: 'Number of CAT accidents',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  catAccidents?: number;

  @ApiPropertyOptional({ 
    description: 'CAT table details',
    example: 'Details of CAT accidents',
  })
  @IsOptional()
  @IsString()
  catTableDetails?: string;
}
