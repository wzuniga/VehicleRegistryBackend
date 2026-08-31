import { PartialType } from '@nestjs/swagger';
import { CreateSatArequipaDto } from './create-sat-arequipa.dto';

export class UpdateSatArequipaDto extends PartialType(CreateSatArequipaDto) {}
