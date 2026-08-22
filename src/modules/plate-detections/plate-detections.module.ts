import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlateDetectionsService } from './plate-detections.service';
import { PlateDetectionsController } from './plate-detections.controller';
import { PlateDetection } from './entities/plate-detection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlateDetection])],
  controllers: [PlateDetectionsController],
  providers: [PlateDetectionsService],
  exports: [PlateDetectionsService],
})
export class PlateDetectionsModule {}
