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
import { SprlSunarpService } from './sprl-sunarp.service';
import { CreateSprlSunarpDto } from './dto/create-sprl-sunarp.dto';
import { UpdateSprlSunarpDto } from './dto/update-sprl-sunarp.dto';

@ApiTags('SPRL SUNARP')
@Controller('sprl-sunarp')
export class SprlSunarpController {
  constructor(private readonly sprlSunarpService: SprlSunarpService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SPRL SUNARP record' })
  @ApiResponse({ status: 201, description: 'Record created successfully' })
  create(@Body() createSprlSunarpDto: CreateSprlSunarpDto) {
    return this.sprlSunarpService.create(createSprlSunarpDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SPRL SUNARP records' })
  @ApiResponse({ status: 200, description: 'List of all records' })
  findAll() {
    return this.sprlSunarpService.findAll();
  }

  @Get('version/:version')
  @ApiOperation({ summary: 'Get records by version' })
  @ApiParam({ name: 'version', type: 'number', description: 'Version number' })
  @ApiResponse({ status: 200, description: 'List of records with specified version' })
  findByVersion(@Param('version', ParseIntPipe) version: number) {
    return this.sprlSunarpService.findByVersion(version);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get records by category' })
  @ApiParam({ name: 'category', type: 'string', description: 'Category name' })
  @ApiResponse({ status: 200, description: 'List of records with specified category' })
  findByCategory(@Param('category') category: string) {
    return this.sprlSunarpService.findByCategory(category);
  }

  @Get('created-by/:createdBy')
  @ApiOperation({ summary: 'Get records by creator user ID' })
  @ApiParam({ name: 'createdBy', type: 'number', description: 'User ID who created the records' })
  @ApiResponse({ status: 200, description: 'List of records created by specified user' })
  findByCreatedBy(@Param('createdBy', ParseIntPipe) createdBy: number) {
    return this.sprlSunarpService.findByCreatedBy(createdBy);
  }

  @Get('plate/:plateNumber')
  @ApiOperation({ summary: 'Get records by plate number' })
  @ApiParam({ name: 'plateNumber', type: 'string', description: 'Plate number' })
  @ApiResponse({ status: 200, description: 'List of records with specified plate number' })
  findByPlateNumber(@Param('plateNumber') plateNumber: string) {
    return this.sprlSunarpService.findByPlateNumber(plateNumber);
  }

  @Get('plate/:plateNumber/max-version')
  @ApiOperation({ summary: 'Get maximum version for a plate number' })
  @ApiParam({ name: 'plateNumber', type: 'string', description: 'Plate number' })
  @ApiResponse({ status: 200, description: 'Maximum version number (0 if plate not found)' })
  async getMaxVersionByPlate(@Param('plateNumber') plateNumber: string) {
    const version = await this.sprlSunarpService.getMaxVersionByPlate(plateNumber);
    return { plateNumber, maxVersion: version };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a SPRL SUNARP record by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Record ID' })
  @ApiResponse({ status: 200, description: 'Record found' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sprlSunarpService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a SPRL SUNARP record' })
  @ApiParam({ name: 'id', type: 'number', description: 'Record ID' })
  @ApiResponse({ status: 200, description: 'Record updated successfully' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateSprlSunarpDto: UpdateSprlSunarpDto,
  ) {
    return this.sprlSunarpService.update(id, updateSprlSunarpDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a SPRL SUNARP record' })
  @ApiParam({ name: 'id', type: 'number', description: 'Record ID' })
  @ApiResponse({ status: 204, description: 'Record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sprlSunarpService.remove(id);
  }
}
