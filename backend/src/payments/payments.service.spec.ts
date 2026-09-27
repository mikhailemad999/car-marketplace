import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { Listing, ListingStatus } from '../entities/listing.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { NotFoundException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let mockPaymentRepo: any;
  let mockListingRepo: any;
  let mockAuditRepo: any;

  beforeEach(async () => {
    mockPaymentRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((p) => Promise.resolve({ id: 101, ...p })),
      find: jest.fn().mockResolvedValue([]),
    };

    mockListingRepo = {
      findOne: jest.fn(),
      save: jest.fn().mockImplementation((l) => Promise.resolve(l)),
    };

    mockAuditRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepo,
        },
        {
          provide: getRepositoryToken(Listing),
          useValue: mockListingRepo,
        },
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockAuditRepo,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create escrow payment', () => {
    it('should create deposit payment and reserve supercar', async () => {
      mockListingRepo.findOne.mockResolvedValue({
        id: 1,
        title: 'Ferrari SF90 Stradale',
        price: 525000,
        status: ListingStatus.PUBLISHED,
      });

      const result = await service.create(
        {
          listingId: 1,
          amount: 5000,
          notes: 'Ferrari Escrow Hold Deposit',
        },
        3,
      );

      expect(result.amount).toBe(5000);
      expect(result.status).toBe(PaymentStatus.COMPLETED);
      expect(mockAuditRepo.save).toHaveBeenCalled();
    });

    it('should mark listing as SOLD when full price is paid', async () => {
      const listing = {
        id: 2,
        title: 'Ferrari F8 Tributo',
        price: 280000,
        status: ListingStatus.PUBLISHED,
      };
      mockListingRepo.findOne.mockResolvedValue(listing);

      await service.create(
        {
          listingId: 2,
          amount: 280000,
          notes: 'FULL_ESCROW_WIRE',
        },
        4,
      );

      expect(listing.status).toBe(ListingStatus.SOLD);
      expect(mockListingRepo.save).toHaveBeenCalledWith(listing);
    });

    it('should throw NotFoundException if car listing does not exist', async () => {
      mockListingRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({ listingId: 999, amount: 5000 }, 1),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
