import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { Listing, ListingStatus } from '../entities/listing.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreatePaymentDto, buyerId: number) {
    const listing = await this.listingRepository.findOne({ where: { id: dto.listingId } });
    if (!listing) {
      throw new NotFoundException(`Listing ${dto.listingId} not found`);
    }

    const payment = this.paymentRepository.create({
      buyerId,
      listingId: dto.listingId,
      amount: dto.amount,
      currency: 'USD',
      status: PaymentStatus.COMPLETED, // Mark completed for demo simulation
      providerTxnId: 'TXN_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
      notes: dto.notes || 'Secured deposit / reservation for ' + listing.title,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // If full payment or reservation, update status
    if (dto.amount >= Number(listing.price)) {
      listing.status = ListingStatus.SOLD;
      await this.listingRepository.save(listing);
    }

    // Log action
    await this.auditLogRepository.save(
      this.auditLogRepository.create({
        userId: buyerId,
        action: 'PAYMENT_INITIATED',
        entity: 'payment',
        entityId: savedPayment.id,
        details: { amount: dto.amount, listingId: dto.listingId, txnId: savedPayment.providerTxnId },
      }),
    );

    // Notify buyer
    await this.notificationsService.createNotification(
      buyerId,
      `Escrow reservation payment of $${Number(dto.amount).toLocaleString()} confirmed for ${listing.title}. Transaction Ref: ${savedPayment.providerTxnId}.`,
    );

    // Notify seller
    if (listing.sellerId && listing.sellerId !== buyerId) {
      await this.notificationsService.createNotification(
        listing.sellerId,
        `Escrow Reservation Alert: A buyer deposited $${Number(dto.amount).toLocaleString()} to hold your ${listing.title}!`,
      );
    }

    return savedPayment;
  }

  async findByBuyer(buyerId: number) {
    return this.paymentRepository.find({
      where: { buyerId },
      relations: ['listing', 'listing.images'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll() {
    return this.paymentRepository.find({
      relations: ['buyer', 'listing'],
      order: { createdAt: 'DESC' },
    });
  }
}
