import { IsNotEmpty, IsInt, IsOptional, IsString, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSprlSunarpDto {
  @ApiProperty({ 
    description: 'Version number',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  version: number;

  @ApiPropertyOptional({ 
    description: 'Registration date',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  registrationDate?: Date;

  @ApiPropertyOptional({ 
    description: 'Presentation date',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  presentationDate?: Date;

  @ApiPropertyOptional({ 
    description: 'Category',
    example: 'Automóvil',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ 
    description: 'Act type',
    example: 'Inscripción',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  actType?: string;

  @ApiPropertyOptional({ 
    description: 'Natural participants',
    example: 'Juan Pérez, María García',
  })
  @IsOptional()
  @IsString()
  naturalParticipants?: string;

  @ApiPropertyOptional({ 
    description: 'Legal participants',
    example: 'Empresa ABC S.A.C.',
  })
  @IsOptional()
  @IsString()
  legalParticipants?: string;

  @ApiPropertyOptional({ 
    description: 'Notes',
    example: 'Observaciones adicionales',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ 
    description: 'ID of user who created this record',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  createdBy: number;

  @ApiPropertyOptional({ 
    description: 'Plate number',
    example: 'ABC-1234',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  plateNumber?: string;
}
