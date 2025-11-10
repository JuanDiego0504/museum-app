import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkEntity } from './artwork.entity';
import { ArtworkService } from './artwork.service';
import { ArtworkController } from './artwork.controller';

@Module({
  providers: [ArtworkService],
  imports: [TypeOrmModule.forFeature([ArtworkEntity])],
  controllers: [ArtworkController],
})
export class ArtworkModule {}
