import { PartialType } from '@nestjs/swagger';
import { CreateSbsInsuranceDto } from './create-sbs-insurance.dto';

export class UpdateSbsInsuranceDto extends PartialType(CreateSbsInsuranceDto) {}
