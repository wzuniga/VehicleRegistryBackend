import { PartialType } from '@nestjs/swagger';
import { CreateLicensePlateMasterDto } from './create-license-plate-master.dto';

export class UpdateLicensePlateMasterDto extends PartialType(CreateLicensePlateMasterDto) {}
