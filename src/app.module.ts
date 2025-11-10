import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from './auth/auth.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { PendingCarPlatesModule } from './modules/pending-car-plates/pending-car-plates.module';
import { typeOrmConfig } from './config/ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    // AuthModule,
    VehiclesModule,
    PendingCarPlatesModule,
  ],
})
export class AppModule {}
