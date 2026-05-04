import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { SprlSunarpTitles } from '../sprl-sunarp/entities/sprl-sunarp-titles.entity';
import { UploadPdfDto } from './dto/upload-pdf.dto';

@Injectable()
export class SprlSunarpTitlesService {
  constructor(
    @InjectRepository(SprlSunarpTitles)
    private repo: Repository<SprlSunarpTitles>,
  ) {}

  async findOne(tituloYear: string, tituloNumber: string): Promise<SprlSunarpTitles> {
    const record = await this.repo.findOne({ where: { tituloYear, tituloNumber } });
    if (!record) throw new NotFoundException(`Title ${tituloYear}-${tituloNumber} not found`);
    return record;
  }

  async findPending(): Promise<SprlSunarpTitles[]> {
    const records = await this.repo.find({
      where: { tituloExtracted: false, attempts: LessThan(2) },
      order: { createdAt: 'ASC' },
    });

    if (records.length > 0) {
      await this.repo
        .createQueryBuilder()
        .update(SprlSunarpTitles)
        .set({ attempts: () => 'attempts + 1' })
        .where('titulo_extracted = false AND attempts < 2')
        .execute();
    }

    return records;
  }

  async uploadPdf(
    tituloYear: string,
    tituloNumber: string,
    dto: UploadPdfDto,
  ): Promise<SprlSunarpTitles> {
    const record = await this.repo.findOne({
      where: { tituloYear, tituloNumber },
    });

    if (!record) {
      throw new NotFoundException(
        `Title ${tituloYear}-${tituloNumber} not found`,
      );
    }

    record.pdfBase64 = dto.pdfBase64;
    record.tituloExtracted = true;
    record.updatedAt = new Date();
    return await this.repo.save(record);
  }
}
