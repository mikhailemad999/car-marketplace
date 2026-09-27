import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async findAllForUser(userId: number) {
    const notifications = await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
    const unreadCount = await this.notificationRepository.count({
      where: { userId, readFlag: false },
    });
    return { notifications, unreadCount };
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, readFlag: false },
    });
  }

  async markAsRead(id: number, userId: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });
    if (!notification) {
      throw new NotFoundException(`Notification #${id} not found`);
    }
    notification.readFlag = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: number) {
    await this.notificationRepository.update(
      { userId, readFlag: false },
      { readFlag: true },
    );
    return { success: true, message: 'All notifications marked as read' };
  }

  async createNotification(
    userId: number,
    content: string,
    type: NotificationType = NotificationType.IN_APP,
  ) {
    const notification = this.notificationRepository.create({
      userId,
      content,
      type,
      readFlag: false,
    });
    return this.notificationRepository.save(notification);
  }
}
