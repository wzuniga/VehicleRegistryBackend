import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePendingCarPlateDto {
  @ApiProperty({
    description: 'Car plate number (unique)',
    example: 'ABC-1234',
    maxLength: 10,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  plate: string;
}
