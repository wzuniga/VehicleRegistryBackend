import { IsNotEmpty, IsString, IsInt, Min, Max, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVehicleDto {
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
    description: 'Serial number',
    example: 'SN123456789',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  serialNumber?: string;

  @ApiPropertyOptional({ 
    description: 'VIN number',
    example: '1HGBH41JXMN109186',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  vinNumber?: string;

  @ApiPropertyOptional({ 
    description: 'Engine number',
    example: 'ENG123456',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  engineNumber?: string;

  @ApiPropertyOptional({ 
    description: 'Color',
    example: 'Blue',
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  color?: string;

  @ApiPropertyOptional({ 
    description: 'Brand',
    example: 'Toyota',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  brand?: string;

  @ApiPropertyOptional({ 
    description: 'Model',
    example: 'Corolla',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  model?: string;

  @ApiPropertyOptional({ 
    description: 'Current plate',
    example: 'ABC-1234',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  currentPlate?: string;

  @ApiPropertyOptional({ 
    description: 'Previous plate',
    example: 'XYZ-9999',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  previousPlate?: string;

  @ApiPropertyOptional({ 
    description: 'State',
    example: 'Active',
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  state?: string;

  @ApiPropertyOptional({ 
    description: 'Notes',
    example: 'Additional information',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ 
    description: 'Branch office',
    example: 'Lima',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  branchOffice?: string;

  @ApiPropertyOptional({ 
    description: 'Model year',
    example: 2023,
    minimum: 1900,
    maximum: 2100,
  })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  modelYear?: number;

  @ApiPropertyOptional({ 
    description: 'Owners information',
    example: 'John Doe, Jane Smith',
  })
  @IsOptional()
  @IsString()
  owners?: string;
}

