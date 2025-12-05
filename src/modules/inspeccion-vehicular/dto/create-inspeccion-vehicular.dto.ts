import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInspeccionVehicularDto {
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
    description: 'Additional data in JSON format',
    example: { inspectionDate: '2025-12-05', status: 'approved', observations: 'Vehicle in good condition' },
  })
  @IsOptional()
  data?: any;
}
