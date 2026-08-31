import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSatDeudaDto {
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
    description: 'Raw SAT deuda payload (papeletas found for this plate)',
    example: {
      success: true,
      papeletas: [
        {
          placa: 'ABC-1234',
          reglamento: 'RGV',
          falta: 'M1',
          documento: '12345678',
          imagenPapeletaUrl: 'https://www.sat.gob.pe/...',
          fecha: '19/01/2026',
          importe: '336.00',
          gastos: '0.00',
          descuento: '0.00',
          deuda: '336.00',
          estado: 'PENDIENTE',
          flagExclusion: null,
          licencia: null,
          tipoDocIdentidad: 'DNI',
          numDocIdentidad: '12345678',
          compromisoPago: null,
        },
      ],
    },
  })
  @IsOptional()
  data?: any;
}
