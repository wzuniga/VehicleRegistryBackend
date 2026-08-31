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
import { SatDeudaService } from './sat-deuda.service';
import { CreateSatDeudaDto } from './dto/create-sat-deuda.dto';
import { UpdateSatDeudaDto } from './dto/update-sat-deuda.dto';

@ApiTags('SAT Deuda')
@Controller('sat-deuda')
export class SatDeudaController {
  constructor(private readonly satDeudaService: SatDeudaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sat deuda record' })
  @ApiResponse({ status: 201, description: 'Sat deuda record created successfully' })
  create(@Body() createSatDeudaDto: CreateSatDeudaDto) {
    return this.satDeudaService.create(createSatDeudaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sat deuda records' })
  @ApiResponse({ status: 200, description: 'List of all sat deuda records' })
  findAll() {
    return this.satDeudaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sat deuda record by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Sat deuda record ID' })
  @ApiResponse({ status: 200, description: 'Sat deuda record found' })
  @ApiResponse({ status: 404, description: 'Sat deuda record not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.satDeudaService.findOne(id);
  }

  @Get('plate/:plateNumber')
  @ApiOperation({ summary: 'Get most recent sat deuda record by plate number' })
  @ApiParam({ name: 'plateNumber', type: 'string', description: 'Plate number' })
  @ApiResponse({ status: 200, description: 'Most recent sat deuda record for the plate' })
  @ApiResponse({ status: 404, description: 'Sat deuda record not found' })
  findByPlateNumber(@Param('plateNumber') plateNumber: string) {
    return this.satDeudaService.findByPlateNumber(plateNumber);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a sat deuda record' })
  @ApiParam({ name: 'id', type: 'number', description: 'Sat deuda record ID' })
  @ApiResponse({ status: 200, description: 'Sat deuda record updated successfully' })
  @ApiResponse({ status: 404, description: 'Sat deuda record not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSatDeudaDto: UpdateSatDeudaDto,
  ) {
    return this.satDeudaService.update(id, updateSatDeudaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a sat deuda record' })
  @ApiParam({ name: 'id', type: 'number', description: 'Sat deuda record ID' })
  @ApiResponse({ status: 204, description: 'Sat deuda record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Sat deuda record not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.satDeudaService.remove(id);
  }
}
