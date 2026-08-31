import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { PendingCarPlatesModule } from './modules/pending-car-plates/pending-car-plates.module';
import { LicensePlateMasterModule } from './modules/license-plate-master/license-plate-master.module';
import { SprlSunarpModule } from './modules/sprl-sunarp/sprl-sunarp.module';
import { SprlSunarpTitlesModule } from './modules/sprl-sunarp-titles/sprl-sunarp-titles.module';
import { SbsInsuranceModule } from './modules/sbs-insurance/sbs-insurance.module';
import { InspeccionVehicularModule } from './modules/inspeccion-vehicular/inspeccion-vehicular.module';
import { SoatApesegModule } from './modules/soat-apeseg/soat-apeseg.module';
import { PlateDetectionsModule } from './modules/plate-detections/plate-detections.module';
import { SatDeudaModule } from './modules/sat-deuda/sat-deuda.module';
import { SatArequipaModule } from './modules/sat-arequipa/sat-arequipa.module';
import { typeOrmConfig } from './config/ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    VehiclesModule,
    PendingCarPlatesModule,
    LicensePlateMasterModule,
    SprlSunarpModule,
    SprlSunarpTitlesModule,
    SbsInsuranceModule,
    InspeccionVehicularModule,
    SoatApesegModule,
    PlateDetectionsModule,
    SatDeudaModule,
    SatArequipaModule,
  ],
})
export class AppModule { }
