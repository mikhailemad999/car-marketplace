import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favorite } from '../entities/favorite.entity';
import { Listing } from '../entities/listing.entity';
import { NotFoundException } from '@nestjs/common';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let mockFavoriteRepo: any;
  let mockListingRepo: any;

  beforeEach(async () => {
    mockFavoriteRepo = {
      findOne: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((f) => Promise.resolve({ id: 1, ...f })),
      remove: jest.fn().mockResolvedValue(true),
    };

    mockListingRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: mockFavoriteRepo,
        },
        {
          provide: getRepositoryToken(Listing),
          useValue: mockListingRepo,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add to favorites if not already favorited', async () => {
    mockListingRepo.findOne.mockResolvedValue({ id: 10, title: 'Ferrari 812 Competizione' });
    mockFavoriteRepo.findOne.mockResolvedValue(null);

    const res = await service.toggle(10, 1);
    expect(res.favorited).toBe(true);
    expect(mockFavoriteRepo.save).toHaveBeenCalled();
  });

  it('should remove from favorites if already favorited (toggle off)', async () => {
    mockListingRepo.findOne.mockResolvedValue({ id: 10, title: 'Ferrari 812 Competizione' });
    mockFavoriteRepo.findOne.mockResolvedValue({ id: 5, listingId: 10, userId: 1 });

    const res = await service.toggle(10, 1);
    expect(res.favorited).toBe(false);
    expect(mockFavoriteRepo.remove).toHaveBeenCalled();
  });

  it('should throw NotFoundException if listing does not exist', async () => {
    mockListingRepo.findOne.mockResolvedValue(null);
    await expect(service.toggle(999, 1)).rejects.toThrow(NotFoundException);
  });

  it('should return favorite IDs array for quick badge lookup', async () => {
    mockFavoriteRepo.find.mockResolvedValue([{ listingId: 1 }, { listingId: 3 }]);
    const ids = await service.getFavoriteIds(1);
    expect(ids).toEqual([1, 3]);
  });
});
