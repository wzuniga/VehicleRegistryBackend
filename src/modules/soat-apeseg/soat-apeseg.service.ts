import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoatApeseg } from './entities/soat-apeseg.entity';
import { CreateSoatApesegDto } from './dto/create-soat-apeseg.dto';
import { UpdateSoatApesegDto } from './dto/update-soat-apeseg.dto';

@Injectable()
export class SoatApesegService {
    constructor(
        @InjectRepository(SoatApeseg)
        private soatApesegRepository: Repository<SoatApeseg>,
    ) { }

    async create(dto: CreateSoatApesegDto): Promise<SoatApeseg> {
        const record = this.soatApesegRepository.create(dto);
        return await this.soatApesegRepository.save(record);
    }

    async findAll(): Promise<SoatApeseg[]> {
        return await this.soatApesegRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<SoatApeseg> {
        const record = await this.soatApesegRepository.findOne({
            where: { id }
        });

        if (!record) {
            throw new NotFoundException(`SOAT APESEG record with ID ${id} not found`);
        }

        return record;
    }

    async findByVersion(version: number): Promise<SoatApeseg[]> {
        return await this.soatApesegRepository.find({
            where: { version },
            order: { createdAt: 'DESC' },
        });
    }

    async findByCreatedBy(createdBy: number): Promise<SoatApeseg[]> {
        return await this.soatApesegRepository.find({
            where: { createdBy },
            order: { createdAt: 'DESC' },
        });
    }

    async findByPlate(plate: string): Promise<SoatApeseg[]> {
        // First, find the maximum version for this plate
        const maxVersionRecord = await this.soatApesegRepository.findOne({
            where: { plate },
            order: { version: 'DESC', createdAt: 'DESC' },
        });

        if (!maxVersionRecord) {
            throw new NotFoundException(`SOAT APESEG records with plate ${plate} not found`);
        }

        // Then, return all records with that maximum version
        return await this.soatApesegRepository.find({
            where: {
                plate,
                version: maxVersionRecord.version,
            },
            order: { createdAt: 'DESC' },
        });
    }

    async getMaxVersionByPlate(plate: string): Promise<number> {
        const record = await this.soatApesegRepository.findOne({
            where: { plate },
            order: { version: 'DESC', createdAt: 'DESC' },
        });

        return record ? record.version : 0;
    }

    async update(id: number, dto: UpdateSoatApesegDto): Promise<SoatApeseg> {
        const record = await this.findOne(id);
        Object.assign(record, dto);
        return await this.soatApesegRepository.save(record);
    }

    async remove(id: number): Promise<void> {
        const record = await this.findOne(id);
        await this.soatApesegRepository.remove(record);
    }
}
