import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SbsInsurance } from './entities/sbs-insurance.entity';
import { CreateSbsInsuranceDto } from './dto/create-sbs-insurance.dto';
import { UpdateSbsInsuranceDto } from './dto/update-sbs-insurance.dto';

@Injectable()
export class SbsInsuranceService {
  constructor(
    @InjectRepository(SbsInsurance)
    private sbsInsuranceRepository: Repository<SbsInsurance>,
  ) {}

  async create(dto: CreateSbsInsuranceDto): Promise<SbsInsurance> {
    const insurance = this.sbsInsuranceRepository.create(dto);
    return await this.sbsInsuranceRepository.save(insurance);
  }

  async findAll(): Promise<SbsInsurance[]> {
    return await this.sbsInsuranceRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SbsInsurance> {
    const insurance = await this.sbsInsuranceRepository.findOne({ where: { id } });
    if (!insurance) {
      throw new NotFoundException(`SBS Insurance record with ID ${id} not found`);
    }
    return insurance;
  }

  async findByPlateNumber(plateNumber: string): Promise<SbsInsurance> {
    const insurance = await this.sbsInsuranceRepository.findOne({
      where: { plateNumber },
      order: { createdAt: 'DESC' },
    });
    if (!insurance) {
      throw new NotFoundException(`SBS Insurance record with plate number ${plateNumber} not found`);
    }
    return insurance;
  }

  async update(id: number, dto: UpdateSbsInsuranceDto): Promise<SbsInsurance> {
    const insurance = await this.findOne(id);
    Object.assign(insurance, dto);
    return await this.sbsInsuranceRepository.save(insurance);
  }

  async remove(id: number): Promise<void> {
    const insurance = await this.findOne(id);
    await this.sbsInsuranceRepository.remove(insurance);
  }
}
