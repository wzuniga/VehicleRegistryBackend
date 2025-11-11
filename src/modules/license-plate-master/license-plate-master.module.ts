import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicensePlateMasterService } from './license-plate-master.service';
import { LicensePlateMasterController } from './license-plate-master.controller';
import { LicensePlateMaster } from './entities/license-plate-master.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LicensePlateMaster])],
  controllers: [LicensePlateMasterController],
  providers: [LicensePlateMasterService],
  exports: [LicensePlateMasterService],
})
export class LicensePlateMasterModule {}
