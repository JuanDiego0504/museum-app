/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { MuseumEntity } from './museum.entity';
import { MuseumQueryDto } from './museum-query.dto';
import { PaginatedResult } from './paginated.types';

@Injectable()
export class MuseumService {
  constructor(
    @InjectRepository(MuseumEntity)
    private readonly museumRepository: Repository<MuseumEntity>,
  ) {}

  // ====== NUEVO: filtros + paginación ======
  async findAllWithFilters(query: MuseumQueryDto): Promise<PaginatedResult<MuseumEntity>> {
    const {
      name,
      city,
      foundedBefore,
      page = 1,
      limit = 10,
    } = query;

    const qb = this.museumRepository
      .createQueryBuilder('m')
      // Si quieres traer relaciones (no suele ser ideal para listados), descomenta:
      // .leftJoinAndSelect('m.artworks', 'aw')
      // .leftJoinAndSelect('m.exhibitions', 'ex')
      ;

    if (name && name.trim() !== '') {
      qb.andWhere('m.name ILIKE :name', { name: `%${name.trim()}%` });
    }

    if (city && city.trim() !== '') {
      qb.andWhere('m.city ILIKE :city', { city: `%${city.trim()}%` });
    }

    if (typeof foundedBefore === 'number') {
      qb.andWhere('m.foundedYear < :fy', { fy: foundedBefore });
    }

    // Paginación
    const safeLimit = Math.max(1, Math.min(100, limit));
    const safePage = Math.max(1, page);
    const skip = (safePage - 1) * safeLimit;

    qb.skip(skip).take(safeLimit).orderBy('m.name', 'ASC');

    const [rows, total] = await qb.getManyAndCount();

    return {
      data: rows,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.max(1, Math.ceil(total / safeLimit)),
      },
    };
  }

  // ====== CRUD existente (lo dejo igual, con null-safety de findOne) ======
  async findAll(): Promise<MuseumEntity[]> {
    return await this.museumRepository.find({ relations: ['artworks', 'exhibitions'] });
  }

  async findOne(id: string): Promise<MuseumEntity> {
    const museum = await this.museumRepository.findOne({ where: { id }, relations: ['artworks', 'exhibitions'] });
    if (!museum) {
      throw new BusinessLogicException('The museum with the given id was not found', BusinessError.NOT_FOUND);
    }
    return museum;
  }

  async create(museum: MuseumEntity): Promise<MuseumEntity> {
    return await this.museumRepository.save(museum);
  }

  async update(id: string, museum: MuseumEntity): Promise<MuseumEntity> {
    const persisted = await this.museumRepository.findOne({ where: { id } });
    if (!persisted) {
      throw new BusinessLogicException('The museum with the given id was not found', BusinessError.NOT_FOUND);
    }
    return await this.museumRepository.save({ ...persisted, ...museum });
  }

  async delete(id: string) {
    const museum = await this.museumRepository.findOne({ where: { id } });
    if (!museum) {
      throw new BusinessLogicException('The museum with the given id was not found', BusinessError.NOT_FOUND);
    }
    await this.museumRepository.remove(museum);
  }
}
