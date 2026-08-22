import { IsOptional, IsBoolean } from 'class-validator';
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
}
