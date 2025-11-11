import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PendingCarPlate } from './entities/pending-car-plate.entity';
import { CreatePendingCarPlateDto } from './dto/create-pending-car-plate.dto';
import { UpdatePendingCarPlateDto } from './dto/update-pending-car-plate.dto';

@Injectable()
export class PendingCarPlatesService {
  constructor(
    @InjectRepository(PendingCarPlate)
    private pendingCarPlatesRepository: Repository<PendingCarPlate>,
  ) {}

  async create(dto: CreatePendingCarPlateDto): Promise<PendingCarPlate> {
    const existing = await this.pendingCarPlatesRepository.findOne({ 
      where: { plate: dto.plate } 
    });
    
    if (existing) {
      throw new ConflictException(`Plate ${dto.plate} already exists`);
    }

    const plate = this.pendingCarPlatesRepository.create(dto);
    return await this.pendingCarPlatesRepository.save(plate);
  }

  async findAll(): Promise<PendingCarPlate[]> {
    return await this.pendingCarPlatesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PendingCarPlate> {
    const plate = await this.pendingCarPlatesRepository.findOne({ 
      where: { id } 
    });
    
    if (!plate) {
      throw new NotFoundException(`Pending car plate with ID ${id} not found`);
    }
    
    return plate;
  }

  async findByPlate(plate: string): Promise<PendingCarPlate> {
    const result = await this.pendingCarPlatesRepository.findOne({ 
      where: { plate } 
    });
    
    if (!result) {
      throw new NotFoundException(`Plate ${plate} not found`);
    }
    
    return result;
  }

  async update(id: number, dto: UpdatePendingCarPlateDto): Promise<PendingCarPlate> {
    const plate = await this.findOne(id);
    
    if (dto.plate && dto.plate !== plate.plate) {
      const existing = await this.pendingCarPlatesRepository.findOne({ 
        where: { plate: dto.plate } 
      });
      if (existing) {
        throw new ConflictException(`Plate ${dto.plate} already exists`);
      }
    }
    
    Object.assign(plate, dto);
    return await this.pendingCarPlatesRepository.save(plate);
  }

  async remove(id: number): Promise<void> {
    const plate = await this.findOne(id);
    await this.pendingCarPlatesRepository.remove(plate);
  }

  async markAsLoaded(id: number): Promise<PendingCarPlate> {
    const plate = await this.findOne(id);
    plate.isLoaded = true;
    return await this.pendingCarPlatesRepository.save(plate);
  }

  async getUnloadedPlates(): Promise<PendingCarPlate[]> {
    return await this.pendingCarPlatesRepository.find({
      where: { isLoaded: false },
      order: { createdAt: 'DESC' },
    });
  }

  async getFirstUnloadedPlate(): Promise<PendingCarPlate> {
    const plate = await this.pendingCarPlatesRepository.findOne({
      where: { isLoaded: false },
      order: { createdAt: 'ASC' },
    });
    
    if (!plate) {
      throw new NotFoundException('No unloaded plates found');
    }
    
    return plate;
  }
}
