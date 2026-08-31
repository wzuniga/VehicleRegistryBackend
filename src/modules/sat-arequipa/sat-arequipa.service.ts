import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SatArequipa } from './entities/sat-arequipa.entity';
import { CreateSatArequipaDto } from './dto/create-sat-arequipa.dto';
import { UpdateSatArequipaDto } from './dto/update-sat-arequipa.dto';

@Injectable()
export class SatArequipaService {
  constructor(
    @InjectRepository(SatArequipa)
    private satArequipaRepository: Repository<SatArequipa>,
  ) {}

  async create(dto: CreateSatArequipaDto): Promise<SatArequipa> {
    const record = this.satArequipaRepository.create(dto);
    return await this.satArequipaRepository.save(record);
  }

  async findAll(): Promise<SatArequipa[]> {
    return await this.satArequipaRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SatArequipa> {
    const record = await this.satArequipaRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Sat Arequipa record with ID ${id} not found`);
    }
    return record;
  }

  async findByPlateNumber(plateNumber: string): Promise<SatArequipa> {
    const record = await this.satArequipaRepository.findOne({
      where: { plateNumber },
      order: { createdAt: 'DESC' },
    });
    if (!record) {
      throw new NotFoundException(`Sat Arequipa record with plate number ${plateNumber} not found`);
    }
    return record;
  }

  async update(id: number, dto: UpdateSatArequipaDto): Promise<SatArequipa> {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return await this.satArequipaRepository.save(record);
  }

  async remove(id: number): Promise<void> {
    const record = await this.findOne(id);
    await this.satArequipaRepository.remove(record);
  }
}
