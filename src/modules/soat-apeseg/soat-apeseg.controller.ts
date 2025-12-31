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
import { SoatApesegService } from './soat-apeseg.service';
import { CreateSoatApesegDto } from './dto/create-soat-apeseg.dto';
import { UpdateSoatApesegDto } from './dto/update-soat-apeseg.dto';

@ApiTags('SOAT APESEG')
@Controller('soat-apeseg')
export class SoatApesegController {
    constructor(private readonly soatApesegService: SoatApesegService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new SOAT APESEG record' })
    @ApiResponse({ status: 201, description: 'Record created successfully' })
    create(@Body() createSoatApesegDto: CreateSoatApesegDto) {
        return this.soatApesegService.create(createSoatApesegDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all SOAT APESEG records' })
    @ApiResponse({ status: 200, description: 'List of all records' })
    findAll() {
        return this.soatApesegService.findAll();
    }

    @Get('version/:version')
    @ApiOperation({ summary: 'Get records by version' })
    @ApiParam({ name: 'version', type: 'number', description: 'Version number' })
    @ApiResponse({ status: 200, description: 'List of records with specified version' })
    findByVersion(@Param('version', ParseIntPipe) version: number) {
        return this.soatApesegService.findByVersion(version);
    }

    @Get('created-by/:createdBy')
    @ApiOperation({ summary: 'Get records by creator user ID' })
    @ApiParam({ name: 'createdBy', type: 'number', description: 'User ID who created the records' })
    @ApiResponse({ status: 200, description: 'List of records created by specified user' })
    findByCreatedBy(@Param('createdBy', ParseIntPipe) createdBy: number) {
        return this.soatApesegService.findByCreatedBy(createdBy);
    }

    @Get('plate/:plate')
    @ApiOperation({ summary: 'Get records by plate (latest version only)' })
    @ApiParam({ name: 'plate', type: 'string', description: 'Plate number' })
    @ApiResponse({ status: 200, description: 'List of records with specified plate and latest version' })
    @ApiResponse({ status: 404, description: 'Records not found' })
    findByPlate(@Param('plate') plate: string) {
        return this.soatApesegService.findByPlate(plate);
    }

    @Get('plate/:plate/max-version')
    @ApiOperation({ summary: 'Get maximum version for a plate' })
    @ApiParam({ name: 'plate', type: 'string', description: 'Plate number' })
    @ApiResponse({ status: 200, description: 'Maximum version number (0 if plate not found)' })
    async getMaxVersionByPlate(@Param('plate') plate: string) {
        const version = await this.soatApesegService.getMaxVersionByPlate(plate);
        return { plate, maxVersion: version };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a SOAT APESEG record by ID' })
    @ApiParam({ name: 'id', type: 'number', description: 'Record ID' })
    @ApiResponse({ status: 200, description: 'Record found' })
    @ApiResponse({ status: 404, description: 'Record not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.soatApesegService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a SOAT APESEG record' })
    @ApiParam({ name: 'id', type: 'number', description: 'Record ID' })
    @ApiResponse({ status: 200, description: 'Record updated successfully' })
    @ApiResponse({ status: 404, description: 'Record not found' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSoatApesegDto: UpdateSoatApesegDto,
    ) {
        return this.soatApesegService.update(id, updateSoatApesegDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a SOAT APESEG record' })
    @ApiParam({ name: 'id', type: 'number', description: 'Record ID' })
    @ApiResponse({ status: 204, description: 'Record deleted successfully' })
    @ApiResponse({ status: 404, description: 'Record not found' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.soatApesegService.remove(id);
    }
}
