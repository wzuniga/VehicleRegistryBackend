import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) {}

  async findAll() {
    return await this.vehiclesRepository.find();
  }

  async findOne(id: string) {
    const vehicle = await this.vehiclesRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async create(dto: CreateVehicleDto, user: any) {
    const vehicle = this.vehiclesRepository.create({
      ...dto,
      createdBy: user.userId,
    });
    return await this.vehiclesRepository.save(vehicle);
  }

  async update(id: string, dto: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);
    Object.assign(vehicle, dto);
    return await this.vehiclesRepository.save(vehicle);
  }

  async remove(id: string) {
    const vehicle = await this.findOne(id);
    await this.vehiclesRepository.remove(vehicle);
    return { message: 'Vehicle deleted successfully' };
  }
}
