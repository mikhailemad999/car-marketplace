import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { Listing } from '../entities/listing.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotFoundException } from '@nestjs/common';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let mockAppointmentRepo: any;
  let mockListingRepo: any;
  let mockAuditRepo: any;
  let mockNotificationsService: any;

  beforeEach(async () => {
    mockAppointmentRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((a) => Promise.resolve({ id: 50, ...a })),
      findOne: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
    };

    mockListingRepo = {
      findOne: jest.fn(),
    };

    mockAuditRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockResolvedValue(true),
    };

    mockNotificationsService = {
      createNotification: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: mockAppointmentRepo,
        },
        {
          provide: getRepositoryToken(Listing),
          useValue: mockListingRepo,
        },
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockAuditRepo,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should book a VIP viewing and send notifications', async () => {
    mockListingRepo.findOne.mockResolvedValue({
      id: 1,
      title: 'Ferrari SF90 Stradale',
      sellerId: 10,
    });
    mockAppointmentRepo.findOne.mockResolvedValue({
      id: 50,
      listingId: 1,
      preferredDate: '2026-10-15',
      timeSlot: '14:00 - 16:00',
      status: AppointmentStatus.CONFIRMED,
    });

    const res = await service.book(
      {
        listingId: 1,
        preferredDate: '2026-10-15',
        timeSlot: '14:00 - 16:00',
        contactPhone: '+39 0536 949111',
      },
      2,
    );

    expect(mockAppointmentRepo.create).toHaveBeenCalled();
    expect(mockAppointmentRepo.save).toHaveBeenCalled();
    expect(mockAuditRepo.save).toHaveBeenCalled();
    expect(mockNotificationsService.createNotification).toHaveBeenCalled();
    expect(res.id).toBe(50);
  });

  it('should throw NotFoundException if car does not exist', async () => {
    mockListingRepo.findOne.mockResolvedValue(null);

    await expect(
      service.book(
        {
          listingId: 999,
          preferredDate: '2026-10-15',
          timeSlot: '10:00',
        },
        2,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update appointment status and notify user', async () => {
    mockAppointmentRepo.findOne.mockResolvedValue({
      id: 50,
      userId: 2,
      status: AppointmentStatus.PENDING,
      listing: { title: 'Ferrari Daytona SP3' },
    });

    const updated = await service.updateStatus(50, AppointmentStatus.COMPLETED);
    expect(updated.status).toBe(AppointmentStatus.COMPLETED);
    expect(mockNotificationsService.createNotification).toHaveBeenCalled();
  });
});
