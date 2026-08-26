import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlateDetection } from './entities/plate-detection.entity';
import { CreatePlateDetectionDto } from './dto/create-plate-detection.dto';
import { UpdateReviewedDto } from './dto/update-reviewed.dto';
import { UpdatePlateDetectionDto } from './dto/update-plate-detection.dto';

export interface PaginatedPlateDetections {
  data: PlateDetection[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const POSTGRES_UNIQUE_VIOLATION = '23505';

@Injectable()
export class PlateDetectionsService {
  constructor(
    @InjectRepository(PlateDetection)
    private repo: Repository<PlateDetection>,
  ) {}

  private normalizePlate(plate?: string): string | null {
    if (!plate) return null;
    const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return normalized || null;
  }

  async create(dto: CreatePlateDetectionDto): Promise<PlateDetection> {
    const detection = this.repo.create({
      ...dto,
      possiblePlate: this.normalizePlate(dto.possiblePlate),
    });
    try {
      return await this.repo.save(detection);
    } catch (err) {
      if (err.code === POSTGRES_UNIQUE_VIOLATION) {
        throw new ConflictException('Esta placa ya fue insertada anteriormente');
      }
      throw err;
    }
  }

  async findAll(page = 1, limit = 10, reviewed?: boolean): Promise<PaginatedPlateDetections> {
    const [data, total] = await this.repo.findAndCount({
      where: reviewed === undefined ? {} : { reviewed },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
  }

  async findOne(id: number): Promise<PlateDetection> {
    const detection = await this.repo.findOne({ where: { id } });
    if (!detection) throw new NotFoundException(`Plate detection with ID ${id} not found`);
    return detection;
  }

  async setReviewed(id: number, dto: UpdateReviewedDto): Promise<PlateDetection> {
    const detection = await this.findOne(id);
    const reviewed = dto.reviewed ?? true;
    detection.reviewed = reviewed;
    detection.reviewedAt = reviewed ? new Date() : null;
    return await this.repo.save(detection);
  }

  async updatePlate(id: number, dto: UpdatePlateDetectionDto): Promise<PlateDetection> {
    const detection = await this.findOne(id);
    detection.possiblePlate = this.normalizePlate(dto.possiblePlate);
    try {
      return await this.repo.save(detection);
    } catch (err) {
      if (err.code === POSTGRES_UNIQUE_VIOLATION) {
        throw new ConflictException('Esta placa ya fue insertada anteriormente');
      }
      throw err;
    }
  }
}
