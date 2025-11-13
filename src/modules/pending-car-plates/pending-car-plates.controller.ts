import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  // UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  // ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PendingCarPlatesService } from './pending-car-plates.service';
import { CreatePendingCarPlateDto } from './dto/create-pending-car-plate.dto';
import { UpdatePendingCarPlateDto } from './dto/update-pending-car-plate.dto';
// import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Pending Car Plates')
@Controller('pending-car-plates')
export class PendingCarPlatesController {
  constructor(private readonly pendingCarPlatesService: PendingCarPlatesService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new pending car plate' })
  @ApiResponse({ status: 201, description: 'Plate created successfully' })
  @ApiResponse({ status: 409, description: 'Plate already exists' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createPendingCarPlateDto: CreatePendingCarPlateDto) {
    return this.pendingCarPlatesService.create(createPendingCarPlateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pending car plates' })
  @ApiResponse({ status: 200, description: 'List of all pending car plates' })
  findAll() {
    return this.pendingCarPlatesService.findAll();
  }

  @Get('unloaded/:letter')
  @ApiOperation({ summary: 'Get all unloaded car plates by letter' })
  @ApiParam({ name: 'letter', type: 'string', description: 'Letter (a-m)', example: 'a' })
  @ApiResponse({ status: 200, description: 'List of unloaded car plates' })
  @ApiResponse({ status: 400, description: 'Invalid letter' })
  getUnloaded(@Param('letter') letter: string) {
    return this.pendingCarPlatesService.getUnloadedPlates(letter);
  }

  @Get('unloaded/:letter/first')
  @ApiOperation({ summary: 'Get the first unloaded car plate by letter' })
  @ApiParam({ name: 'letter', type: 'string', description: 'Letter (a-m)', example: 'a' })
  @ApiResponse({ status: 200, description: 'First unloaded car plate found' })
  @ApiResponse({ status: 404, description: 'No unloaded plates found' })
  @ApiResponse({ status: 400, description: 'Invalid letter' })
  getFirstUnloaded(@Param('letter') letter: string) {
    return this.pendingCarPlatesService.getFirstUnloadedPlate(letter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pending car plate by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Plate ID' })
  @ApiResponse({ status: 200, description: 'Plate found' })
  @ApiResponse({ status: 404, description: 'Plate not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pendingCarPlatesService.findOne(id);
  }

  @Get('plate/:plate')
  @ApiOperation({ summary: 'Get a pending car plate by plate number' })
  @ApiParam({ name: 'plate', type: 'string', description: 'Plate number' })
  @ApiResponse({ status: 200, description: 'Plate found' })
  @ApiResponse({ status: 404, description: 'Plate not found' })
  findByPlate(@Param('plate') plate: string) {
    return this.pendingCarPlatesService.findByPlate(plate);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a pending car plate' })
  @ApiParam({ name: 'id', type: 'number', description: 'Plate ID' })
  @ApiResponse({ status: 200, description: 'Plate updated successfully' })
  @ApiResponse({ status: 404, description: 'Plate not found' })
  @ApiResponse({ status: 409, description: 'Plate already exists' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePendingCarPlateDto: UpdatePendingCarPlateDto,
  ) {
    return this.pendingCarPlatesService.update(id, updatePendingCarPlateDto);
  }

  @Patch(':id/mark-loaded/:letter')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark a plate as loaded for specific letter' })
  @ApiParam({ name: 'id', type: 'number', description: 'Plate ID' })
  @ApiParam({ name: 'letter', type: 'string', description: 'Letter (a-m)', example: 'a' })
  @ApiResponse({ status: 200, description: 'Plate marked as loaded' })
  @ApiResponse({ status: 404, description: 'Plate not found' })
  @ApiResponse({ status: 400, description: 'Invalid letter' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  markAsLoaded(
    @Param('id', ParseIntPipe) id: number,
    @Param('letter') letter: string,
  ) {
    return this.pendingCarPlatesService.markAsLoaded(id, letter);
  }

  @Patch(':id/reset-attempts/:letter')
  @ApiOperation({ summary: 'Reset search attempts for a plate by letter' })
  @ApiParam({ name: 'id', type: 'number', description: 'Plate ID' })
  @ApiParam({ name: 'letter', type: 'string', description: 'Letter (a-m)', example: 'a' })
  @ApiResponse({ status: 200, description: 'Search attempts reset to 0' })
  @ApiResponse({ status: 404, description: 'Plate not found' })
  @ApiResponse({ status: 400, description: 'Invalid letter' })
  resetSearchAttempts(
    @Param('id', ParseIntPipe) id: number,
    @Param('letter') letter: string,
  ) {
    return this.pendingCarPlatesService.resetSearchAttempts(id, letter);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a pending car plate' })
  @ApiParam({ name: 'id', type: 'number', description: 'Plate ID' })
  @ApiResponse({ status: 204, description: 'Plate deleted successfully' })
  @ApiResponse({ status: 404, description: 'Plate not found' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pendingCarPlatesService.remove(id);
  }
}
