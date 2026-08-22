import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PlateDetectionsService } from './plate-detections.service';
import { CreatePlateDetectionDto } from './dto/create-plate-detection.dto';
import { UpdateReviewedDto } from './dto/update-reviewed.dto';

@ApiTags('Plate Detections')
@Controller('plate-detections')
export class PlateDetectionsController {
  constructor(private readonly service: PlateDetectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Save a new plate detection (image + possible plate)' })
  @ApiResponse({ status: 201, description: 'Detection saved successfully' })
  create(@Body() dto: CreatePlateDetectionDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all plate detections' })
  @ApiQuery({ name: 'reviewed', required: false, type: Boolean, description: 'Filter by reviewed status' })
  @ApiResponse({ status: 200, description: 'List of plate detections' })
  findAll(@Query('reviewed') reviewed?: string) {
    const parsed = reviewed === undefined ? undefined : reviewed === 'true';
    return this.service.findAll(parsed);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a plate detection by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Detection found' })
  @ApiResponse({ status: 404, description: 'Detection not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id/reviewed')
  @ApiOperation({ summary: 'Mark a plate detection as reviewed or not reviewed' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Reviewed status updated' })
  @ApiResponse({ status: 404, description: 'Detection not found' })
  setReviewed(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReviewedDto) {
    return this.service.setReviewed(id, dto);
  }
}
