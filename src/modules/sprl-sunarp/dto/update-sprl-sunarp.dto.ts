import { PartialType } from '@nestjs/swagger';
import { CreateSprlSunarpDto } from './create-sprl-sunarp.dto';

export class UpdateSprlSunarpDto extends PartialType(CreateSprlSunarpDto) {}
