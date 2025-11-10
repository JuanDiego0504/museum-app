/* eslint-disable prettier/prettier */
import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class MuseumQueryDto {
  @IsOptional()
  @IsString()
  name?: string; // filtro: name ILIKE %name%

  @IsOptional()
  @IsString()
  city?: string; // filtro: city ILIKE %city%

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  foundedBefore?: number; // filtro: foundedYear < foundedBefore

  // paginación
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number; // default: 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number; // default: 10
}
