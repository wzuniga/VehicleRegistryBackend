import { PartialType } from '@nestjs/swagger';
import { CreateInspeccionVehicularDto } from './create-inspeccion-vehicular.dto';

export class UpdateInspeccionVehicularDto extends PartialType(CreateInspeccionVehicularDto) {}
