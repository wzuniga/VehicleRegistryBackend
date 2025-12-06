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
import { InspeccionVehicularService } from './inspeccion-vehicular.service';
import { CreateInspeccionVehicularDto } from './dto/create-inspeccion-vehicular.dto';
import { UpdateInspeccionVehicularDto } from './dto/update-inspeccion-vehicular.dto';

@ApiTags('Inspeccion Vehicular')
@Controller('inspeccion-vehicular')
export class InspeccionVehicularController {
  constructor(private readonly inspeccionVehicularService: InspeccionVehicularService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inspeccion vehicular' })
  @ApiResponse({ status: 201, description: 'Inspeccion vehicular created successfully' })
  create(@Body() createInspeccionVehicularDto: CreateInspeccionVehicularDto) {
    return this.inspeccionVehicularService.create(createInspeccionVehicularDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inspecciones vehiculares' })
  @ApiResponse({ status: 200, description: 'List of all inspecciones vehiculares' })
  findAll() {
    return this.inspeccionVehicularService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an inspeccion vehicular by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Inspeccion vehicular ID' })
  @ApiResponse({ status: 200, description: 'Inspeccion vehicular found' })
  @ApiResponse({ status: 404, description: 'Inspeccion vehicular not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inspeccionVehicularService.findOne(id);
  }

  @Get('plate/:plateNumber')
  @ApiOperation({ summary: 'Get most recent inspeccion vehicular by plate number' })
  @ApiParam({ name: 'plateNumber', type: 'string', description: 'Plate number' })
  @ApiResponse({ status: 200, description: 'Most recent inspeccion vehicular for the plate' })
  @ApiResponse({ status: 404, description: 'Inspeccion vehicular not found' })
  findByPlateNumber(@Param('plateNumber') plateNumber: string) {
    return this.inspeccionVehicularService.findByPlateNumber(plateNumber);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an inspeccion vehicular' })
  @ApiParam({ name: 'id', type: 'number', description: 'Inspeccion vehicular ID' })
  @ApiResponse({ status: 200, description: 'Inspeccion vehicular updated successfully' })
  @ApiResponse({ status: 404, description: 'Inspeccion vehicular not found' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateInspeccionVehicularDto: UpdateInspeccionVehicularDto,
  ) {
    return this.inspeccionVehicularService.update(id, updateInspeccionVehicularDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an inspeccion vehicular' })
  @ApiParam({ name: 'id', type: 'number', description: 'Inspeccion vehicular ID' })
  @ApiResponse({ status: 204, description: 'Inspeccion vehicular deleted successfully' })
  @ApiResponse({ status: 404, description: 'Inspeccion vehicular not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inspeccionVehicularService.remove(id);
  }
}
