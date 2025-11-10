/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MuseumModule } from './museum/museum.module';
import { ExhibitionModule } from './exhibition/exhibition.module';
import { ArtworkModule } from './artwork/artwork.module';
import { SponsorModule } from './sponsor/sponsor.module';
import { ArtistModule } from './artist/artist.module';
import { MovementModule } from './movement/movement.module';
import { ImageModule } from './image/image.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from './artist/artist.entity';
import { ArtworkEntity } from './artwork/artwork.entity';
import { ExhibitionEntity } from './exhibition/exhibition.entity';
import { ImageEntity } from './image/image.entity';
import { MovementEntity } from './movement/movement.entity';
import { MuseumEntity } from './museum/museum.entity';
import { SponsorEntity } from './sponsor/sponsor.entity';
import { MuseumArtworkModule } from './museum-artwork/museum-artwork.module';

@Module({
  imports: [
    // --- PostgreSQL (tu config actual) ---
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'museum',
      entities: [
        ArtistEntity,
        ArtworkEntity,
        ExhibitionEntity,
        ImageEntity,
        MovementEntity,
        MuseumEntity,
        SponsorEntity,
      ],
      dropSchema: true,
      synchronize: true,
      autoLoadEntities: false
    }),

    // --- Alternativa SQLite (si no quieres Postgres local) ---
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'museum.db',
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: true,
    // }),

    MuseumModule,
    ExhibitionModule,
    ArtworkModule,
    SponsorModule,
    ImageModule,
    ArtistModule,
    MovementModule,
    MuseumArtworkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
