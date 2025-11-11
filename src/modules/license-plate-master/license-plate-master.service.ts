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

  async create(dto: CreateLicensePlateMasterDto): Promise<any> {
    // Convertir a mayúsculas
    const plateNumberUpper = dto.plateNumber.toUpperCase();
    
    // Validar si existe
    const existing = await this.licensePlateMasterRepository.findOne({ 
      where: { plateNumber: plateNumberUpper } 
    });
    
    if (existing) {
      return {
        message: 'Plate already exists',
        exists: true,
        data: existing,
      };
    }

    // Crear nuevo registro
    const plate = this.licensePlateMasterRepository.create({
      ...dto,
      plateNumber: plateNumberUpper,
    });
    const saved = await this.licensePlateMasterRepository.save(plate);
    
    return {
      message: 'Plate created successfully',
      exists: false,
      data: saved,
    };
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
    // Convertir a mayúsculas para buscar
    const plateNumberUpper = plateNumber.toUpperCase();
    
    const result = await this.licensePlateMasterRepository.findOne({ 
      where: { plateNumber: plateNumberUpper } 
    });
    
    if (!result) {
      throw new NotFoundException(`Plate number ${plateNumberUpper} not found`);
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
    
    // Convertir a mayúsculas si se proporciona plateNumber
    if (dto.plateNumber) {
      dto.plateNumber = dto.plateNumber.toUpperCase();
      
      if (dto.plateNumber !== plate.plateNumber) {
        const existing = await this.licensePlateMasterRepository.findOne({ 
          where: { plateNumber: dto.plateNumber } 
        });
        if (existing) {
          throw new ConflictException(`Plate number ${dto.plateNumber} already exists`);
        }
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
