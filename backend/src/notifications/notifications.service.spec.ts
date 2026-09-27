import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification, NotificationType } from '../entities/notification.entity';
import { NotFoundException } from '@nestjs/common';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let mockNotificationRepo: any;

  beforeEach(async () => {
    mockNotificationRepo = {
      find: jest.fn().mockResolvedValue([
        { id: 1, userId: 1, content: 'Welcome to Scuderia Ferrari', readFlag: false },
      ]),
      count: jest.fn().mockResolvedValue(1),
      findOne: jest.fn(),
      save: jest.fn().mockImplementation((n) => Promise.resolve(n)),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      create: jest.fn().mockImplementation((dto) => dto),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepo,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all notifications and unread count for user', async () => {
    const res = await service.findAllForUser(1);
    expect(res.notifications.length).toBe(1);
    expect(res.unreadCount).toBe(1);
  });

  it('should mark single notification as read', async () => {
    mockNotificationRepo.findOne.mockResolvedValue({ id: 1, userId: 1, readFlag: false });
    const res = await service.markAsRead(1, 1);
    expect(res.readFlag).toBe(true);
  });

  it('should throw NotFoundException if notification does not exist', async () => {
    mockNotificationRepo.findOne.mockResolvedValue(null);
    await expect(service.markAsRead(999, 1)).rejects.toThrow(NotFoundException);
  });

  it('should mark all notifications as read', async () => {
    const res = await service.markAllAsRead(1);
    expect(res.success).toBe(true);
    expect(mockNotificationRepo.update).toHaveBeenCalled();
  });

  it('should create in-app notification', async () => {
    const created = await service.createNotification(2, 'Escrow deposit received', NotificationType.IN_APP);
    expect(created.content).toBe('Escrow deposit received');
    expect(created.userId).toBe(2);
  });
});
