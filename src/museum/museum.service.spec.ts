/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { MuseumService } from './museum.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MuseumEntity } from './museum.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { MuseumQueryDto } from './museum-query.dto';

type RepoMock = Partial<Record<keyof Repository<MuseumEntity>, jest.Mock>> & {
  createQueryBuilder?: jest.Mock;
};

describe('MuseumService (filters & pagination)', () => {
  let service: MuseumService;
  let repo: RepoMock;
  let qb: Partial<SelectQueryBuilder<MuseumEntity>>;

  beforeEach(async () => {
    qb = {
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
    };

    repo = {
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MuseumService,
        {
          provide: getRepositoryToken(MuseumEntity),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<MuseumService>(MuseumService);
  });

  it('aplica name y city con ILIKE y foundedBefore', async () => {
    (qb.getManyAndCount as jest.Mock).mockResolvedValue([[{ id: '1' } as MuseumEntity], 1]);

    const query: MuseumQueryDto = { name: 'oro', city: 'bogota', foundedBefore: 1900, page: 1, limit: 10 };
    const result = await service.findAllWithFilters(query);

    expect(repo.createQueryBuilder).toHaveBeenCalledWith('m');
    expect(qb.andWhere).toHaveBeenCalledWith('m.name ILIKE :name', { name: '%oro%' });
    expect(qb.andWhere).toHaveBeenCalledWith('m.city ILIKE :city', { city: '%bogota%' });
    expect(qb.andWhere).toHaveBeenCalledWith('m.foundedYear < :fy', { fy: 1900 });
    expect(qb.skip).toHaveBeenCalledWith(0);
    expect(qb.take).toHaveBeenCalledWith(10);
    expect(result.meta.total).toBe(1);
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(10);
    expect(result.data.length).toBe(1);
  });

  it('usa defaults page=1, limit=10 cuando no llegan', async () => {
    await service.findAllWithFilters({});
    expect(qb.skip).toHaveBeenCalledWith(0);
    expect(qb.take).toHaveBeenCalledWith(10);
  });

  it('paginación calcula skip correctamente (page=3, limit=5)', async () => {
    await service.findAllWithFilters({ page: 3, limit: 5 });
    expect(qb.skip).toHaveBeenCalledWith(10);
    expect(qb.take).toHaveBeenCalledWith(5);
  });
});
