import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InspeccionVehicular } from './entities/inspeccion-vehicular.entity';
import { CreateInspeccionVehicularDto } from './dto/create-inspeccion-vehicular.dto';
import { UpdateInspeccionVehicularDto } from './dto/update-inspeccion-vehicular.dto';

@Injectable()
export class InspeccionVehicularService {
  constructor(
    @InjectRepository(InspeccionVehicular)
    private inspeccionVehicularRepository: Repository<InspeccionVehicular>,
  ) {}

  async create(dto: CreateInspeccionVehicularDto): Promise<InspeccionVehicular> {
    const inspeccion = this.inspeccionVehicularRepository.create(dto);
    return await this.inspeccionVehicularRepository.save(inspeccion);
  }

  async findAll(): Promise<InspeccionVehicular[]> {
    return await this.inspeccionVehicularRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<InspeccionVehicular> {
    const inspeccion = await this.inspeccionVehicularRepository.findOne({ where: { id } });
    if (!inspeccion) {
      throw new NotFoundException(`Inspeccion vehicular with ID ${id} not found`);
    }
    return inspeccion;
  }

  async findByPlateNumber(plateNumber: string): Promise<InspeccionVehicular[]> {
    return await this.inspeccionVehicularRepository.find({
      where: { plateNumber },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, dto: UpdateInspeccionVehicularDto): Promise<InspeccionVehicular> {
    const inspeccion = await this.findOne(id);
    Object.assign(inspeccion, dto);
    return await this.inspeccionVehicularRepository.save(inspeccion);
  }

  async remove(id: number): Promise<void> {
    const inspeccion = await this.findOne(id);
    await this.inspeccionVehicularRepository.remove(inspeccion);
  }
}
