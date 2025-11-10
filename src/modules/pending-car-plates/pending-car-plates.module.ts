import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingCarPlatesService } from './pending-car-plates.service';
import { PendingCarPlatesController } from './pending-car-plates.controller';
import { PendingCarPlate } from './entities/pending-car-plate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PendingCarPlate])],
  controllers: [PendingCarPlatesController],
  providers: [PendingCarPlatesService],
  exports: [PendingCarPlatesService],
})
export class PendingCarPlatesModule {}
