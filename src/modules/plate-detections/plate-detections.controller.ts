import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PlateDetectionsService } from './plate-detections.service';
import { CreatePlateDetectionDto } from './dto/create-plate-detection.dto';
import { UpdateReviewedDto } from './dto/update-reviewed.dto';
import { UpdatePlateDetectionDto } from './dto/update-plate-detection.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get paginated plate detections (admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number, 1-indexed (default 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Results per page (default 10)' })
  @ApiQuery({ name: 'reviewed', required: false, type: Boolean, description: 'Filter by reviewed status' })
  @ApiResponse({ status: 200, description: 'Paginated list of plate detections' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('reviewed') reviewed?: string,
  ) {
    const parsedPage = page ? Math.max(1, parseInt(page, 10)) : 1;
    const parsedLimit = limit ? Math.max(1, parseInt(limit, 10)) : 10;
    const parsedReviewed = reviewed === undefined ? undefined : reviewed === 'true';
    return this.service.findAll(parsedPage, parsedLimit, parsedReviewed);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a plate detection by ID (admin only)' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Detection found' })
  @ApiResponse({ status: 404, description: 'Detection not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id/reviewed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark a plate detection as reviewed or not reviewed (admin only)' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Reviewed status updated' })
  @ApiResponse({ status: 404, description: 'Detection not found' })
  setReviewed(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReviewedDto) {
    return this.service.setReviewed(id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Manually correct the detected plate (admin only)' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Plate corrected' })
  @ApiResponse({ status: 404, description: 'Detection not found' })
  updatePlate(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePlateDetectionDto) {
    return this.service.updatePlate(id, dto);
  }
}
