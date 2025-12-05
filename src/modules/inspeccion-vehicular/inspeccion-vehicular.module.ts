import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspeccionVehicularService } from './inspeccion-vehicular.service';
import { InspeccionVehicularController } from './inspeccion-vehicular.controller';
import { InspeccionVehicular } from './entities/inspeccion-vehicular.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InspeccionVehicular])],
  providers: [InspeccionVehicularService],
  controllers: [InspeccionVehicularController],
  exports: [InspeccionVehicularService],
})
export class InspeccionVehicularModule {}
