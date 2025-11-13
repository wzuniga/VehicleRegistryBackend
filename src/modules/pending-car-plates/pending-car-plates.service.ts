import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { PendingCarPlate } from './entities/pending-car-plate.entity';
import { CreatePendingCarPlateDto } from './dto/create-pending-car-plate.dto';
import { UpdatePendingCarPlateDto } from './dto/update-pending-car-plate.dto';

type ValidLetter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm';

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

  private validateLetter(letter: string): ValidLetter {
    const validLetters: ValidLetter[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];
    const lowerLetter = letter.toLowerCase();
    if (!validLetters.includes(lowerLetter as ValidLetter)) {
      throw new BadRequestException(`Invalid letter. Must be one of: ${validLetters.join(', ')}`);
    }
    return lowerLetter as ValidLetter;
  }

  async markAsLoaded(id: number, letter: string): Promise<PendingCarPlate> {
    const validLetter = this.validateLetter(letter);
    const plate = await this.findOne(id);
    const isLoadedField = `${validLetter}IsLoaded` as keyof PendingCarPlate;
    (plate as any)[isLoadedField] = true;
    return await this.pendingCarPlatesRepository.save(plate);
  }

  async getUnloadedPlates(letter: string): Promise<PendingCarPlate[]> {
    const validLetter = this.validateLetter(letter);
    const isLoadedField = `${validLetter}_is_loaded`;
    const searchAttemptsField = `${validLetter}_search_attempts`;
    
    return await this.pendingCarPlatesRepository.find({
      where: { 
        [isLoadedField]: false,
        [searchAttemptsField]: LessThan(3),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getFirstUnloadedPlate(letter: string): Promise<PendingCarPlate> {
    const validLetter = this.validateLetter(letter);
    const isLoadedField = `${validLetter}_is_loaded`;
    const searchAttemptsField = `${validLetter}_search_attempts`;
    
    // Buscar placa no cargada con menos de 3 intentos
    const plate = await this.pendingCarPlatesRepository.findOne({
      where: { 
        [isLoadedField]: false,
        [searchAttemptsField]: LessThan(3),
      },
      order: { createdAt: 'ASC' },
    });
    
    if (!plate) {
      throw new NotFoundException(`No unloaded plates found for letter '${validLetter}' with less than 3 attempts`);
    }
    
    // Incrementar searchAttempts
    const camelCaseAttempts = `${validLetter}SearchAttempts` as keyof PendingCarPlate;
    (plate as any)[camelCaseAttempts] += 1;
    await this.pendingCarPlatesRepository.save(plate);
    
    return plate;
  }

  async resetSearchAttempts(id: number, letter: string): Promise<PendingCarPlate> {
    const validLetter = this.validateLetter(letter);
    const plate = await this.findOne(id);
    const searchAttemptsField = `${validLetter}SearchAttempts` as keyof PendingCarPlate;
    (plate as any)[searchAttemptsField] = 0;
    return await this.pendingCarPlatesRepository.save(plate);
  }
}
