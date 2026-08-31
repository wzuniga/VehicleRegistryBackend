import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { SatArequipaService } from './sat-arequipa.service';
import { CreateSatArequipaDto } from './dto/create-sat-arequipa.dto';
import { UpdateSatArequipaDto } from './dto/update-sat-arequipa.dto';

@ApiTags('SAT Arequipa')
@Controller('sat-arequipa')
export class SatArequipaController {
  constructor(private readonly satArequipaService: SatArequipaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sat arequipa record' })
  @ApiResponse({ status: 201, description: 'Sat arequipa record created successfully' })
  create(@Body() createSatArequipaDto: CreateSatArequipaDto) {
    return this.satArequipaService.create(createSatArequipaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sat arequipa records' })
  @ApiResponse({ status: 200, description: 'List of all sat arequipa records' })
  findAll() {
    return this.satArequipaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sat arequipa record by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Sat arequipa record ID' })
  @ApiResponse({ status: 200, description: 'Sat arequipa record found' })
  @ApiResponse({ status: 404, description: 'Sat arequipa record not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.satArequipaService.findOne(id);
  }

  @Get('plate/:plateNumber')
  @ApiOperation({ summary: 'Get most recent sat arequipa record by plate number' })
  @ApiParam({ name: 'plateNumber', type: 'string', description: 'Plate number' })
  @ApiResponse({ status: 200, description: 'Most recent sat arequipa record for the plate' })
  @ApiResponse({ status: 404, description: 'Sat arequipa record not found' })
  findByPlateNumber(@Param('plateNumber') plateNumber: string) {
    return this.satArequipaService.findByPlateNumber(plateNumber);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a sat arequipa record' })
  @ApiParam({ name: 'id', type: 'number', description: 'Sat arequipa record ID' })
  @ApiResponse({ status: 200, description: 'Sat arequipa record updated successfully' })
  @ApiResponse({ status: 404, description: 'Sat arequipa record not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSatArequipaDto: UpdateSatArequipaDto,
  ) {
    return this.satArequipaService.update(id, updateSatArequipaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a sat arequipa record' })
  @ApiParam({ name: 'id', type: 'number', description: 'Sat arequipa record ID' })
  @ApiResponse({ status: 204, description: 'Sat arequipa record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Sat arequipa record not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.satArequipaService.remove(id);
  }
}
