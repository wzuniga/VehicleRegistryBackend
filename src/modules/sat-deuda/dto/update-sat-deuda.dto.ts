import { PartialType } from '@nestjs/swagger';
import { CreateSatDeudaDto } from './create-sat-deuda.dto';

export class UpdateSatDeudaDto extends PartialType(CreateSatDeudaDto) {}
