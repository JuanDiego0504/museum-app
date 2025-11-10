/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MuseumDto } from './museum.dto';
import { MuseumEntity } from './museum.entity';
import { MuseumService } from './museum.service';

@Controller('museums')
@UseInterceptors(BusinessErrorsInterceptor)
export class MuseumController {
  constructor(private readonly museumService: MuseumService) {}

  // GET /museums
  @Get()
  async findAll(): Promise<MuseumEntity[]> {
    return await this.museumService.findAll();
  }

  // GET /museums/:museumId
  @Get(':museumId')
  async findOne(@Param('museumId') museumId: string): Promise<MuseumEntity> {
    return await this.museumService.findOne(museumId);
  }

  // POST /museums
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  async create(@Body() museumDto: MuseumDto): Promise<MuseumEntity> {
    const museum: MuseumEntity = plainToInstance(MuseumEntity, museumDto);
    return await this.museumService.create(museum);
  }

  // PUT /museums/:museumId
  @Put(':museumId')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  async update(
    @Param('museumId') museumId: string,
    @Body() museumDto: MuseumDto,
  ): Promise<MuseumEntity> {
    const museum: MuseumEntity = plainToInstance(MuseumEntity, museumDto);
    return await this.museumService.update(museumId, museum);
  }

  // DELETE /museums/:museumId
  @Delete(':museumId')
  @HttpCode(204)
  async delete(@Param('museumId') museumId: string): Promise<void> {
    return await this.museumService.delete(museumId);
  }
}
