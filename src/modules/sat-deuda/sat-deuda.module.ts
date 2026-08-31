import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SatDeudaService } from './sat-deuda.service';
import { SatDeudaController } from './sat-deuda.controller';
import { SatDeuda } from './entities/sat-deuda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SatDeuda])],
  providers: [SatDeudaService],
  controllers: [SatDeudaController],
  exports: [SatDeudaService],
})
export class SatDeudaModule {}
