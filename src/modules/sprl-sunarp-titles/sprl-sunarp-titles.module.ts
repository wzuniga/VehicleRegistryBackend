import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprlSunarpTitles } from '../sprl-sunarp/entities/sprl-sunarp-titles.entity';
import { SprlSunarpTitlesService } from './sprl-sunarp-titles.service';
import { SprlSunarpTitlesController } from './sprl-sunarp-titles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SprlSunarpTitles])],
  controllers: [SprlSunarpTitlesController],
  providers: [SprlSunarpTitlesService],
})
export class SprlSunarpTitlesModule {}
