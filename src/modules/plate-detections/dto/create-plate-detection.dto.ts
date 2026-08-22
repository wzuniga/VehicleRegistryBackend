import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlateDetectionDto {
  @ApiProperty({ description: 'Base64-encoded image of the detected plate' })
  @IsNotEmpty()
  @IsString()
  imageBase64: string;

  @ApiProperty({
    description: 'Possible plate text detected by the recognition app',
    example: 'ABC-123',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  possiblePlate?: string;
}
