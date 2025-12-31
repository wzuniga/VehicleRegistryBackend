import { IsNotEmpty, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSoatApesegDto {
    @ApiProperty({
        description: 'Version number',
        example: 1,
    })
    @IsNotEmpty()
    @IsInt()
    version: number;

    @ApiProperty({
        description: 'Plate number',
        example: 'F9N139',
        maxLength: 20,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    plate: string;

    @ApiPropertyOptional({
        description: 'Insurance company name',
        example: 'Pacifico Seguros',
        maxLength: 200,
    })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    nombreCompania?: string;

    @ApiPropertyOptional({
        description: 'Start date',
        example: '19/01/2025',
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    fechaInicio?: string;

    @ApiPropertyOptional({
        description: 'End date',
        example: '19/01/2026',
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    fechaFin?: string;

    @ApiPropertyOptional({
        description: 'Policy number',
        example: '000000000201117006300100',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    numeroPoliza?: string;

    @ApiPropertyOptional({
        description: 'Vehicle use name',
        example: 'PARTICULAR',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    nombreUsoVehiculo?: string;

    @ApiPropertyOptional({
        description: 'Vehicle class name',
        example: 'AUTOMOVIL',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    nombreClaseVehiculo?: string;

    @ApiPropertyOptional({
        description: 'Status',
        example: 'VIGENTE',
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    estado?: string;

    @ApiPropertyOptional({
        description: 'Unique policy code',
        example: '0440000000002011170063001001',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    codigoUnicoPoliza?: string;

    @ApiPropertyOptional({
        description: 'SBS insurance code',
        example: '044',
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    codigoSBSAseguradora?: string;

    @ApiPropertyOptional({
        description: 'Police control date',
        example: '19/01/2026',
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    fechaControlPolicial?: string;

    @ApiPropertyOptional({
        description: 'Contractor name',
        example: 'Juan Pérez',
        maxLength: 200,
    })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    nombreContratante?: string;

    @ApiPropertyOptional({
        description: 'Ubigeo name',
        example: 'Lima - Lima - Miraflores',
        maxLength: 200,
    })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    nombreUbigeo?: string;

    @ApiPropertyOptional({
        description: 'Engine serial number',
        example: 'MTR123456',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    numeroSerieMotor?: string;

    @ApiPropertyOptional({
        description: 'Chassis serial number',
        example: 'CHS123456',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    numeroSerieChasis?: string;

    @ApiPropertyOptional({
        description: 'Insurance number',
        example: '123456',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    numeroAseguradora?: string;

    @ApiPropertyOptional({
        description: 'Certificate type',
        example: 'DIGITAL',
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    tipoCertificado?: string;

    @ApiPropertyOptional({
        description: 'Creation date',
        example: '19/01/2025 06:54',
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    fechaCreacion?: string;

    @ApiPropertyOptional({
        description: 'Number of seats',
        example: '5',
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    numeroAsientos?: string;

    @ApiPropertyOptional({
        description: 'Vehicle model',
        example: 'Corolla',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    modeloVehiculo?: string;

    @ApiPropertyOptional({
        description: 'Vehicle brand',
        example: 'Toyota',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    marca?: string;

    @ApiProperty({
        description: 'ID of user who created this record',
        example: 1,
    })
    @IsNotEmpty()
    @IsInt()
    createdBy: number;
}
