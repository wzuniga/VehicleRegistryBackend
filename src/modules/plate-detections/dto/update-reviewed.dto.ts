import { IsOptional, IsBoolean, IsNumber, Min, Max, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewedDto {
  @ApiProperty({
    description: 'Reviewed status to set. Defaults to true when omitted.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  reviewed?: boolean;

  @ApiProperty({
    description: 'Whether a plate was actually detected/accepted for this image',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasPlate?: boolean;

  @ApiProperty({
    description: 'Model confidence for this detection, 0-1',
    example: 0.94,
    minimum: 0,
    maximum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;

  @ApiProperty({
    description: 'Raw plate text read by the model, kept for traceability even when not accepted',
    example: 'ABC123',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  detectedPlate?: string;
}
