import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SbsInsuranceService } from './sbs-insurance.service';
import { SbsInsuranceController } from './sbs-insurance.controller';
import { SbsInsurance } from './entities/sbs-insurance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SbsInsurance])],
  controllers: [SbsInsuranceController],
  providers: [SbsInsuranceService],
  exports: [SbsInsuranceService],
})
export class SbsInsuranceModule {}
