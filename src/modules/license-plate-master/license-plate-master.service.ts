import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LicensePlateMaster } from './entities/license-plate-master.entity';
import { CreateLicensePlateMasterDto } from './dto/create-license-plate-master.dto';
import { UpdateLicensePlateMasterDto } from './dto/update-license-plate-master.dto';

@Injectable()
export class LicensePlateMasterService {
  constructor(
    @InjectRepository(LicensePlateMaster)
    private licensePlateMasterRepository: Repository<LicensePlateMaster>,
  ) {}

  async create(dto: CreateLicensePlateMasterDto): Promise<LicensePlateMaster> {
    const existing = await this.licensePlateMasterRepository.findOne({ 
      where: { plateNumber: dto.plateNumber } 
    });
    
    if (existing) {
      throw new ConflictException(`Plate number ${dto.plateNumber} already exists`);
    }

    const plate = this.licensePlateMasterRepository.create(dto);
    return await this.licensePlateMasterRepository.save(plate);
  }

  async findAll(): Promise<LicensePlateMaster[]> {
    return await this.licensePlateMasterRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<LicensePlateMaster> {
    const plate = await this.licensePlateMasterRepository.findOne({ 
      where: { id } 
    });
    
    if (!plate) {
      throw new NotFoundException(`License plate with ID ${id} not found`);
    }
    
    return plate;
  }

  async findByPlateNumber(plateNumber: string): Promise<LicensePlateMaster> {
    const result = await this.licensePlateMasterRepository.findOne({ 
      where: { plateNumber } 
    });
    
    if (!result) {
      throw new NotFoundException(`Plate number ${plateNumber} not found`);
    }
    
    return result;
  }

  async findByPublicCode(publicCode: string): Promise<LicensePlateMaster> {
    const result = await this.licensePlateMasterRepository.findOne({ 
      where: { publicCode } 
    });
    
    if (!result) {
      throw new NotFoundException(`License plate with public code ${publicCode} not found`);
    }
    
    return result;
  }

  async update(id: number, dto: UpdateLicensePlateMasterDto): Promise<LicensePlateMaster> {
    const plate = await this.findOne(id);
    
    if (dto.plateNumber && dto.plateNumber !== plate.plateNumber) {
      const existing = await this.licensePlateMasterRepository.findOne({ 
        where: { plateNumber: dto.plateNumber } 
      });
      if (existing) {
        throw new ConflictException(`Plate number ${dto.plateNumber} already exists`);
      }
    }
    
    Object.assign(plate, dto);
    return await this.licensePlateMasterRepository.save(plate);
  }

  async remove(id: number): Promise<void> {
    const plate = await this.findOne(id);
    await this.licensePlateMasterRepository.remove(plate);
  }
}
