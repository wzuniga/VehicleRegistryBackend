import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SatArequipaService } from './sat-arequipa.service';
import { SatArequipaController } from './sat-arequipa.controller';
import { SatArequipa } from './entities/sat-arequipa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SatArequipa])],
  providers: [SatArequipaService],
  controllers: [SatArequipaController],
  exports: [SatArequipaService],
})
export class SatArequipaModule {}
