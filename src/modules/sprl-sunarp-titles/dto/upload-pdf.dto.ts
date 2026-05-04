import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadPdfDto {
  @ApiProperty({ description: 'Base64-encoded PDF content' })
  @IsNotEmpty()
  @IsString()
  pdfBase64: string;
}
