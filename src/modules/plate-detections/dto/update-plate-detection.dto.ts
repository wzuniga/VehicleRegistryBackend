import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlateDetectionDto {
  @ApiProperty({
    description: 'Corrected plate text, entered manually by an admin',
    example: 'ABC-123',
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  possiblePlate: string;
}
