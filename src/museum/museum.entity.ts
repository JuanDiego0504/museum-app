/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Index } from 'typeorm';
import { ExhibitionEntity } from '../exhibition/exhibition.entity';
import { ArtworkEntity } from '../artwork/artwork.entity';

@Entity()
export class MuseumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index() // útil para LIKE/ILIKE por nombre
  @Column()
  name: string;

  @Index() // útil para LIKE/ILIKE por ciudad
  @Column()
  city: string;

  @Column({ type: 'int', nullable: true })
  foundedYear: number | null;

  @OneToMany(() => ExhibitionEntity, (ex) => ex.museum, { cascade: true })
  exhibitions: ExhibitionEntity[];

  @OneToMany(() => ArtworkEntity, (aw) => aw.museum, { cascade: true })
  artworks: ArtworkEntity[];
}
