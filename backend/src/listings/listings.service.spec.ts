import { Test, TestingModule } from '@nestjs/testing';
import { ListingsService } from './listings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Listing, ListingStatus } from '../entities/listing.entity';
import { Image } from '../entities/image.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';

describe('ListingsService', () => {
  let service: ListingsService;
  let mockListingRepo: any;
  let mockImageRepo: any;
  let mockAuditRepo: any;

  beforeEach(async () => {
    mockListingRepo = {
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((item) => Promise.resolve({ id: 10, ...item })),
      remove: jest.fn().mockResolvedValue(true),
      createQueryBuilder: jest.fn(),
    };

    mockImageRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockResolvedValue([]),
    };

    mockAuditRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        {
          provide: getRepositoryToken(Listing),
          useValue: mockListingRepo,
        },
        {
          provide: getRepositoryToken(Image),
          useValue: mockImageRepo,
        },
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockAuditRepo,
        },
      ],
    }).compile();

    service = module.get<ListingsService>(ListingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return a listing if found', async () => {
      const mockCar = { id: 1, title: 'Ferrari SF90 Stradale Assetto Fiorano' };
      mockListingRepo.findOne.mockResolvedValue(mockCar);

      const result = await service.findById(1);
      expect(result).toEqual(mockCar);
      expect(mockListingRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['seller', 'images'],
      });
    });

    it('should throw NotFoundException if listing does not exist', async () => {
      mockListingRepo.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and certify supercar listing with audit log', async () => {
      const dto = {
        title: '2024 Ferrari Daytona SP3',
        price: 2250000,
        model: 'Daytona SP3',
        color: 'Rosso Magma',
        year: 2024,
        mileage: 450,
        isCertified: true,
        sellerPhone: '+1-555-0199',
      };

      mockListingRepo.save.mockResolvedValue({ id: 25, ...dto, status: ListingStatus.PUBLISHED });
      mockListingRepo.findOne.mockResolvedValue({ id: 25, ...dto, status: ListingStatus.PUBLISHED });

      const result = await service.create(dto as any, 2);

      expect(mockListingRepo.create).toHaveBeenCalled();
      expect(mockListingRepo.save).toHaveBeenCalled();
      expect(mockAuditRepo.save).toHaveBeenCalled();
      expect(result.id).toBe(25);
    });
  });

  describe('update & remove permissions', () => {
    it('should forbid non-owner non-admin from updating listing', async () => {
      mockListingRepo.findOne.mockResolvedValue({ id: 5, sellerId: 10 });

      await expect(
        service.update(5, { title: 'Hacked' }, 99, UserRole.BUYER),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow admin to delete any listing', async () => {
      mockListingRepo.findOne.mockResolvedValue({ id: 5, sellerId: 10, title: 'Test Car' });

      const result = await service.remove(5, 1, UserRole.ADMIN);
      expect(result.success).toBe(true);
      expect(mockListingRepo.remove).toHaveBeenCalled();
    });
  });
});
