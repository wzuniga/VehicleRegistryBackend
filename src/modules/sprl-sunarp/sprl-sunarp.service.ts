import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SprlSunarp } from './entities/sprl-sunarp.entity';
import { CreateSprlSunarpDto } from './dto/create-sprl-sunarp.dto';
import { UpdateSprlSunarpDto } from './dto/update-sprl-sunarp.dto';

@Injectable()
export class SprlSunarpService {
  constructor(
    @InjectRepository(SprlSunarp)
    private sprlSunarpRepository: Repository<SprlSunarp>,
  ) {}

  async create(dto: CreateSprlSunarpDto): Promise<SprlSunarp> {
    const record = this.sprlSunarpRepository.create(dto);
    return await this.sprlSunarpRepository.save(record);
  }

  async findAll(): Promise<SprlSunarp[]> {
    return await this.sprlSunarpRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SprlSunarp> {
    const record = await this.sprlSunarpRepository.findOne({ 
      where: { id } 
    });
    
    if (!record) {
      throw new NotFoundException(`SPRL SUNARP record with ID ${id} not found`);
    }
    
    return record;
  }

  async findByVersion(version: number): Promise<SprlSunarp[]> {
    return await this.sprlSunarpRepository.find({
      where: { version },
      order: { createdAt: 'DESC' },
    });
  }

  async findByCategory(category: string): Promise<SprlSunarp[]> {
    return await this.sprlSunarpRepository.find({
      where: { category },
      order: { createdAt: 'DESC' },
    });
  }

  async findByCreatedBy(createdBy: number): Promise<SprlSunarp[]> {
    return await this.sprlSunarpRepository.find({
      where: { createdBy },
      order: { createdAt: 'DESC' },
    });
  }

  async findByPlateNumber(plateNumber: string): Promise<SprlSunarp[]> {
    // First, find the maximum version for this plate
    const maxVersionRecord = await this.sprlSunarpRepository.findOne({
      where: { plateNumber },
      order: { version: 'DESC', createdAt: 'DESC' },
    });

    if (!maxVersionRecord) {
      throw new NotFoundException(`SPRL SUNARP records with plate number ${plateNumber} not found`);
    }

    // Then, return all records with that maximum version
    return await this.sprlSunarpRepository.find({
      where: { 
        plateNumber,
        version: maxVersionRecord.version,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getMaxVersionByPlate(plateNumber: string): Promise<number> {
    const record = await this.sprlSunarpRepository.findOne({
      where: { plateNumber },
      order: { version: 'DESC', createdAt: 'DESC' },
    });
    
    return record ? record.version : 0;
  }

  async update(id: number, dto: UpdateSprlSunarpDto): Promise<SprlSunarp> {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return await this.sprlSunarpRepository.save(record);
  }

  async remove(id: number): Promise<void> {
    const record = await this.findOne(id);
    await this.sprlSunarpRepository.remove(record);
  }
}
