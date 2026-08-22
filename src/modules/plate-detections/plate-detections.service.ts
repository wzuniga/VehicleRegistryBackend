import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlateDetection } from './entities/plate-detection.entity';
import { CreatePlateDetectionDto } from './dto/create-plate-detection.dto';
import { UpdateReviewedDto } from './dto/update-reviewed.dto';

@Injectable()
export class PlateDetectionsService {
  constructor(
    @InjectRepository(PlateDetection)
    private repo: Repository<PlateDetection>,
  ) {}

  async create(dto: CreatePlateDetectionDto): Promise<PlateDetection> {
    const detection = this.repo.create(dto);
    return await this.repo.save(detection);
  }

  async findAll(reviewed?: boolean): Promise<PlateDetection[]> {
    return await this.repo.find({
      where: reviewed === undefined ? {} : { reviewed },
      order: { createdAt: 'DESC' },
    });
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
}
