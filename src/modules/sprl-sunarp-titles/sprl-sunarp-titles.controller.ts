import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SprlSunarpTitlesService } from './sprl-sunarp-titles.service';
import { UploadPdfDto } from './dto/upload-pdf.dto';

@ApiTags('SPRL SUNARP Titles')
@Controller('sprl-sunarp-titles')
export class SprlSunarpTitlesController {
  constructor(private readonly service: SprlSunarpTitlesService) {}

  @Get('pending')
  @ApiOperation({
    summary: 'Get pending titles (attempts < 2 and not extracted), increments attempts',
  })
  @ApiResponse({ status: 200, description: 'List of pending title records' })
  findPending() {
    return this.service.findPending();
  }

  @Patch(':tituloYear/:tituloNumber/pdf')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload PDF base64 and mark title as extracted' })
  @ApiParam({ name: 'tituloYear', type: 'string' })
  @ApiParam({ name: 'tituloNumber', type: 'string' })
  @ApiResponse({ status: 200, description: 'Record updated with PDF' })
  @ApiResponse({ status: 404, description: 'Title not found' })
  uploadPdf(
    @Param('tituloYear') tituloYear: string,
    @Param('tituloNumber') tituloNumber: string,
    @Body() dto: UploadPdfDto,
  ) {
    return this.service.uploadPdf(tituloYear, tituloNumber, dto);
  }
}
