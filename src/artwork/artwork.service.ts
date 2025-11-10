/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtworkEntity } from './artwork.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ArtworkService {
  constructor(
    @InjectRepository(ArtworkEntity)
    private readonly artworkRepository: Repository<ArtworkEntity>,
  ) {}

  async findAll(): Promise<ArtworkEntity[]> {
    return await this.artworkRepository.find({ relations: ['images'] });
  }

  async findOne(id: string): Promise<ArtworkEntity> {
    // findOne puede devolver null -> no tipar a ArtworkEntity en el LHS
    const artwork = await this.artworkRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!artwork) {
      throw new BusinessLogicException(
        'The artwork with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    // tras el guard, TS sabe que artwork es ArtworkEntity
    return artwork;
  }

  async create(artwork: ArtworkEntity): Promise<ArtworkEntity> {
    return await this.artworkRepository.save(artwork);
  }

  async update(id: string, artwork: ArtworkEntity): Promise<ArtworkEntity> {
    // puede ser null
    const persisted = await this.artworkRepository.findOne({ where: { id } });
    if (!persisted) {
      throw new BusinessLogicException(
        'The artwork with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.artworkRepository.save({ ...persisted, ...artwork });
  }

  async delete(id: string): Promise<void> {
    // puede ser null
    const artwork = await this.artworkRepository.findOne({ where: { id } });
    if (!artwork) {
      throw new BusinessLogicException(
        'The artwork with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.artworkRepository.remove(artwork);
  }
}
