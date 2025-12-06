import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
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
import { SbsInsuranceService } from './sbs-insurance.service';
import { CreateSbsInsuranceDto } from './dto/create-sbs-insurance.dto';
import { UpdateSbsInsuranceDto } from './dto/update-sbs-insurance.dto';

@ApiTags('SBS Insurance')
@Controller('sbs-insurance')
export class SbsInsuranceController {
  constructor(private readonly sbsInsuranceService: SbsInsuranceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SBS insurance record' })
  @ApiResponse({ status: 201, description: 'Insurance record created successfully' })
  create(@Body() createSbsInsuranceDto: CreateSbsInsuranceDto) {
    return this.sbsInsuranceService.create(createSbsInsuranceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SBS insurance records' })
  @ApiResponse({ status: 200, description: 'List of all insurance records' })
  findAll() {
    return this.sbsInsuranceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an SBS insurance record by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Insurance record ID' })
  @ApiResponse({ status: 200, description: 'Insurance record found' })
  @ApiResponse({ status: 404, description: 'Insurance record not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sbsInsuranceService.findOne(id);
  }

  @Get('plate/:plateNumber')
  @ApiOperation({ summary: 'Get most recent SBS insurance record by plate number' })
  @ApiParam({ name: 'plateNumber', type: 'string', description: 'Plate number' })
  @ApiResponse({ status: 200, description: 'Most recent insurance record for the plate' })
  @ApiResponse({ status: 404, description: 'Insurance record not found' })
  findByPlateNumber(@Param('plateNumber') plateNumber: string) {
    return this.sbsInsuranceService.findByPlateNumber(plateNumber);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an SBS insurance record' })
  @ApiParam({ name: 'id', type: 'number', description: 'Insurance record ID' })
  @ApiResponse({ status: 200, description: 'Insurance record updated successfully' })
  @ApiResponse({ status: 404, description: 'Insurance record not found' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateSbsInsuranceDto: UpdateSbsInsuranceDto,
  ) {
    return this.sbsInsuranceService.update(id, updateSbsInsuranceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an SBS insurance record' })
  @ApiParam({ name: 'id', type: 'number', description: 'Insurance record ID' })
  @ApiResponse({ status: 204, description: 'Insurance record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Insurance record not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sbsInsuranceService.remove(id);
  }
}
