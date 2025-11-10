import { IsOptional, IsString, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePendingCarPlateDto {
  @ApiProperty({
    description: 'Car plate number',
    example: 'ABC-1234',
    maxLength: 10,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  plate?: string;

  @ApiProperty({
    description: 'Whether the plate has been loaded',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isLoaded?: boolean;
}
