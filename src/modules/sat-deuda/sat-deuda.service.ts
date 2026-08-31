import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SatDeuda } from './entities/sat-deuda.entity';
import { CreateSatDeudaDto } from './dto/create-sat-deuda.dto';
import { UpdateSatDeudaDto } from './dto/update-sat-deuda.dto';

@Injectable()
export class SatDeudaService {
  constructor(
    @InjectRepository(SatDeuda)
    private satDeudaRepository: Repository<SatDeuda>,
  ) {}

  async create(dto: CreateSatDeudaDto): Promise<SatDeuda> {
    const record = this.satDeudaRepository.create(dto);
    return await this.satDeudaRepository.save(record);
  }

  async findAll(): Promise<SatDeuda[]> {
    return await this.satDeudaRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SatDeuda> {
    const record = await this.satDeudaRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Sat deuda record with ID ${id} not found`);
    }
    return record;
  }

  async findByPlateNumber(plateNumber: string): Promise<SatDeuda> {
    const record = await this.satDeudaRepository.findOne({
      where: { plateNumber },
      order: { createdAt: 'DESC' },
    });
    if (!record) {
      throw new NotFoundException(`Sat deuda record with plate number ${plateNumber} not found`);
    }
    return record;
  }

  async update(id: number, dto: UpdateSatDeudaDto): Promise<SatDeuda> {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return await this.satDeudaRepository.save(record);
  }

  async remove(id: number): Promise<void> {
    const record = await this.findOne(id);
    await this.satDeudaRepository.remove(record);
  }
}
