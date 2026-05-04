import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprlSunarpService } from './sprl-sunarp.service';
import { SprlSunarpController } from './sprl-sunarp.controller';
import { SprlSunarp } from './entities/sprl-sunarp.entity';
import { SprlSunarpTitles } from './entities/sprl-sunarp-titles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SprlSunarp, SprlSunarpTitles])],
  controllers: [SprlSunarpController],
  providers: [SprlSunarpService],
  exports: [SprlSunarpService],
})
export class SprlSunarpModule {}
