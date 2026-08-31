import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSatArequipaDto {
  @ApiProperty({
    description: 'Plate number (required)',
    example: 'ABC-1234',
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  plateNumber: string;

  @ApiPropertyOptional({
    description: 'Raw SAT Arequipa payload (infracciones found for this plate)',
    example: {
      success: true,
      infracciones: [
        {
          concepto: 'PAPELETA DE INFRACCION DE TRANSITO',
          nroInfraccion: '000123456',
          placa: 'ABC-1234',
          fecha: '19/01/2026',
          codInfraccion: 'M1',
          infractor: 'Juan Perez',
          estado: 'PENDIENTE',
          monto: '336.00',
        },
      ],
    },
  })
  @IsOptional()
  data?: any;
}
