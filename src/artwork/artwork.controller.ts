/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ArtworkDto } from './artwork.dto';
import { ArtworkEntity } from './artwork.entity';
import { ArtworkService } from './artwork.service';

@Controller('artworks')
@UseInterceptors(BusinessErrorsInterceptor)
export class ArtworkController {
    constructor(private readonly artworkService: ArtworkService) {}

  @Get()
  async findAll() {
    return await this.artworkService.findAll();
  }

  @Get(':artworkId') 
  async findOne(@Param('artworkId') artworkId: string) {
    return await this.artworkService.findOne(artworkId);
  }

  @Post()
  async create(@Body() artworkDto: ArtworkDto) {
    const artwork = plainToInstance(ArtworkEntity, artworkDto);
    return await this.artworkService.create(artwork);
  }

  @Put(':artworkId')
  async update(@Param('artworkId') artworkId: string, @Body() artworkDto: ArtworkDto) {
    const artwork = plainToInstance(ArtworkEntity, artworkDto);
    return await this.artworkService.update(artworkId, artwork);
  }

  @Delete(':artworkId')
  @HttpCode(204)
  async delete(@Param('artworkId') artworkId: string) {
    return await this.artworkService.delete(artworkId);
  }

}
