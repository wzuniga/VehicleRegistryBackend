import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLicensePlateMasterDto {
  @ApiProperty({ 
    description: 'Plate number',
    example: 'ABC-1234',
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  plateNumber: string;
}
