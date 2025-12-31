import { PartialType } from '@nestjs/swagger';
import { CreateSoatApesegDto } from './create-soat-apeseg.dto';

export class UpdateSoatApesegDto extends PartialType(CreateSoatApesegDto) { }
