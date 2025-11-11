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
import { LicensePlateMasterService } from './license-plate-master.service';
import { CreateLicensePlateMasterDto } from './dto/create-license-plate-master.dto';
import { UpdateLicensePlateMasterDto } from './dto/update-license-plate-master.dto';

@ApiTags('License Plate Master')
@Controller('license-plate-master')
export class LicensePlateMasterController {
  constructor(private readonly licensePlateMasterService: LicensePlateMasterService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new license plate' })
  @ApiResponse({ status: 201, description: 'License plate created successfully or already exists' })
  create(@Body() createLicensePlateMasterDto: CreateLicensePlateMasterDto) {
    return this.licensePlateMasterService.create(createLicensePlateMasterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all license plates' })
  @ApiResponse({ status: 200, description: 'List of all license plates' })
  findAll() {
    return this.licensePlateMasterService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a license plate by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'License plate ID' })
  @ApiResponse({ status: 200, description: 'License plate found' })
  @ApiResponse({ status: 404, description: 'License plate not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.licensePlateMasterService.findOne(id);
  }

  @Get('plate/:plateNumber')
  @ApiOperation({ summary: 'Get a license plate by plate number' })
  @ApiParam({ name: 'plateNumber', type: 'string', description: 'Plate number' })
  @ApiResponse({ status: 200, description: 'License plate found' })
  @ApiResponse({ status: 404, description: 'License plate not found' })
  findByPlateNumber(@Param('plateNumber') plateNumber: string) {
    return this.licensePlateMasterService.findByPlateNumber(plateNumber);
  }

  @Get('public-code/:publicCode')
  @ApiOperation({ summary: 'Get a license plate by public code' })
  @ApiParam({ name: 'publicCode', type: 'string', description: 'Public code (UUID)' })
  @ApiResponse({ status: 200, description: 'License plate found' })
  @ApiResponse({ status: 404, description: 'License plate not found' })
  findByPublicCode(@Param('publicCode') publicCode: string) {
    return this.licensePlateMasterService.findByPublicCode(publicCode);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a license plate' })
  @ApiParam({ name: 'id', type: 'number', description: 'License plate ID' })
  @ApiResponse({ status: 200, description: 'License plate updated successfully' })
  @ApiResponse({ status: 404, description: 'License plate not found' })
  @ApiResponse({ status: 409, description: 'Plate number already exists' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateLicensePlateMasterDto: UpdateLicensePlateMasterDto,
  ) {
    return this.licensePlateMasterService.update(id, updateLicensePlateMasterDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a license plate' })
  @ApiParam({ name: 'id', type: 'number', description: 'License plate ID' })
  @ApiResponse({ status: 204, description: 'License plate deleted successfully' })
  @ApiResponse({ status: 404, description: 'License plate not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.licensePlateMasterService.remove(id);
  }
}
