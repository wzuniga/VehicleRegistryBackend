import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SprlSunarp } from './entities/sprl-sunarp.entity';
import { SprlSunarpTitles } from './entities/sprl-sunarp-titles.entity';
import { CreateSprlSunarpDto } from './dto/create-sprl-sunarp.dto';
import { UpdateSprlSunarpDto } from './dto/update-sprl-sunarp.dto';

export type SprlSunarpWithExtracted = SprlSunarp & { tituloExtracted?: boolean };

@Injectable()
export class SprlSunarpService {
  constructor(
    @InjectRepository(SprlSunarp)
    private sprlSunarpRepository: Repository<SprlSunarp>,
    @InjectRepository(SprlSunarpTitles)
    private sprlSunarpTitlesRepository: Repository<SprlSunarpTitles>,
  ) {}

  private async enrichWithTituloExtracted(
    records: SprlSunarp[],
  ): Promise<SprlSunarpWithExtracted[]> {
    const pairs = records.filter(r => r.tituloYear && r.tituloNumber);
    if (pairs.length === 0) return records;

    const titles = await this.sprlSunarpTitlesRepository.find({
      where: pairs.map(r => ({ tituloYear: r.tituloYear, tituloNumber: r.tituloNumber })),
      select: ['tituloYear', 'tituloNumber', 'tituloExtracted'],
    });

    const map = new Map(
      titles.map(t => [`${t.tituloYear}|${t.tituloNumber}`, t.tituloExtracted]),
    );

    return records.map(r => ({
      ...r,
      tituloExtracted:
        r.tituloYear && r.tituloNumber
          ? (map.get(`${r.tituloYear}|${r.tituloNumber}`) ?? false)
          : undefined,
    }));
  }

  async create(dto: CreateSprlSunarpDto): Promise<SprlSunarp> {
    const record = this.sprlSunarpRepository.create(dto);
    const saved = await this.sprlSunarpRepository.save(record);

    if (dto.tituloYear && dto.tituloNumber) {
      await this.sprlSunarpTitlesRepository
        .createQueryBuilder()
        .insert()
        .into(SprlSunarpTitles)
        .values({ tituloYear: dto.tituloYear, tituloNumber: dto.tituloNumber, plate: dto.plateNumber ?? null })
        .orIgnore()
        .execute();
    }

    return saved;
  }

  async findAll(): Promise<SprlSunarpWithExtracted[]> {
    const records = await this.sprlSunarpRepository.find({ order: { createdAt: 'DESC' } });
    return this.enrichWithTituloExtracted(records);
  }

  async findOne(id: number): Promise<SprlSunarpWithExtracted> {
    const record = await this.sprlSunarpRepository.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`SPRL SUNARP record with ID ${id} not found`);
    const [enriched] = await this.enrichWithTituloExtracted([record]);
    return enriched;
  }

  async findByVersion(version: number): Promise<SprlSunarpWithExtracted[]> {
    const records = await this.sprlSunarpRepository.find({ where: { version }, order: { createdAt: 'DESC' } });
    return this.enrichWithTituloExtracted(records);
  }

  async findByCategory(category: string): Promise<SprlSunarpWithExtracted[]> {
    const records = await this.sprlSunarpRepository.find({ where: { category }, order: { createdAt: 'DESC' } });
    return this.enrichWithTituloExtracted(records);
  }

  async findByCreatedBy(createdBy: number): Promise<SprlSunarpWithExtracted[]> {
    const records = await this.sprlSunarpRepository.find({ where: { createdBy }, order: { createdAt: 'DESC' } });
    return this.enrichWithTituloExtracted(records);
  }

  async findByPlateNumber(plateNumber: string): Promise<SprlSunarpWithExtracted[]> {
    const maxVersionRecord = await this.sprlSunarpRepository.findOne({
      where: { plateNumber },
      order: { version: 'DESC', createdAt: 'DESC' },
    });

    if (!maxVersionRecord) {
      throw new NotFoundException(`SPRL SUNARP records with plate number ${plateNumber} not found`);
    }

    const records = await this.sprlSunarpRepository.find({
      where: { plateNumber, version: maxVersionRecord.version },
      order: { createdAt: 'DESC' },
    });
    return this.enrichWithTituloExtracted(records);
  }

  async getMaxVersionByPlate(plateNumber: string): Promise<number> {
    const record = await this.sprlSunarpRepository.findOne({
      where: { plateNumber },
      order: { version: 'DESC', createdAt: 'DESC' },
    });
    return record ? record.version : 0;
  }

  async update(id: number, dto: UpdateSprlSunarpDto): Promise<SprlSunarpWithExtracted> {
    const record = await this.sprlSunarpRepository.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`SPRL SUNARP record with ID ${id} not found`);
    Object.assign(record, dto);
    const saved = await this.sprlSunarpRepository.save(record);
    const [enriched] = await this.enrichWithTituloExtracted([saved]);
    return enriched;
  }

  async remove(id: number): Promise<void> {
    const record = await this.sprlSunarpRepository.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`SPRL SUNARP record with ID ${id} not found`);
    await this.sprlSunarpRepository.remove(record);
  }
}
