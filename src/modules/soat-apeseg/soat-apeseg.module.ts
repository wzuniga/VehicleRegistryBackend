import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoatApesegService } from './soat-apeseg.service';
import { SoatApesegController } from './soat-apeseg.controller';
import { SoatApeseg } from './entities/soat-apeseg.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SoatApeseg])],
    controllers: [SoatApesegController],
    providers: [SoatApesegService],
    exports: [SoatApesegService],
})
export class SoatApesegModule { }
