import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { Listing } from '../entities/listing.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async book(dto: CreateAppointmentDto, userId: number) {
    const listing = await this.listingRepository.findOne({ where: { id: dto.listingId } });
    if (!listing) {
      throw new NotFoundException(`Listing #${dto.listingId} not found`);
    }

    const appointment = this.appointmentRepository.create({
      userId,
      listingId: dto.listingId,
      preferredDate: dto.preferredDate,
      timeSlot: dto.timeSlot,
      contactPhone: dto.contactPhone || null,
      notes: dto.notes || null,
      location: dto.location || 'Maranello VIP Atelier, Italy',
      status: AppointmentStatus.CONFIRMED,
    });

    const saved = await this.appointmentRepository.save(appointment);

    // Audit log
    await this.auditLogRepository.save(
      this.auditLogRepository.create({
        userId,
        action: 'BOOK_APPOINTMENT',
        entity: 'appointment',
        entityId: saved.id,
        details: { listingId: dto.listingId, date: dto.preferredDate, slot: dto.timeSlot },
      }),
    );

    // Send in-app notification to the user
    await this.notificationsService.createNotification(
      userId,
      `VIP Atelier Viewing Confirmed for ${listing.title} on ${dto.preferredDate} at ${dto.timeSlot}. Concierge liaison assigned.`,
    );

    // Send notification to seller if available
    if (listing.sellerId && listing.sellerId !== userId) {
      await this.notificationsService.createNotification(
        listing.sellerId,
        `New VIP Viewing scheduled for your ${listing.title} on ${dto.preferredDate} (${dto.timeSlot}).`,
      );
    }

    return this.appointmentRepository.findOne({
      where: { id: saved.id },
      relations: ['listing', 'listing.images'],
    });
  }

  async findByUser(userId: number) {
    return this.appointmentRepository.find({
      where: { userId },
      relations: ['listing', 'listing.images'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll() {
    return this.appointmentRepository.find({
      relations: ['user', 'listing'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: number, status: AppointmentStatus) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['listing'],
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    appointment.status = status;
    const updated = await this.appointmentRepository.save(appointment);

    await this.notificationsService.createNotification(
      appointment.userId,
      `Your VIP appointment for ${appointment.listing?.title || 'Supercar'} has been updated to: ${status.toUpperCase()}.`,
    );

    return updated;
  }
}
