import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing, ListingStatus } from '../entities/listing.entity';
import { User, UserRole } from '../entities/user.entity';
import { Payment } from '../entities/payment.entity';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async getAnalytics() {
    const totalListings = await this.listingRepository.count();
    const publishedListings = await this.listingRepository.count({
      where: { status: ListingStatus.PUBLISHED },
    });
    const soldListings = await this.listingRepository.count({
      where: { status: ListingStatus.SOLD },
    });
    const totalUsers = await this.userRepository.count();

    const listings = await this.listingRepository.find({ select: ['price'] });
    const totalInventoryValue = listings.reduce((sum, item) => sum + Number(item.price || 0), 0);

    const payments = await this.paymentRepository.find({ select: ['amount'] });
    const totalPaymentsVolume = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return {
      totalListings,
      publishedListings,
      soldListings,
      totalUsers,
      totalInventoryValue,
      totalPaymentsVolume,
      activePlatformModel: 'Ferrari SF90 Stradale & Supercar Collection',
    };
  }

  async getAuditLogs(limit = 50) {
    return this.auditLogRepository.find({
      relations: ['user'],
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async getAllUsers() {
    return this.userRepository.find({
      select: ['id', 'name', 'email', 'phone', 'role', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateUserRole(id: number, role: UserRole) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    user.role = role;
    return this.userRepository.save(user);
  }

  async certifyListing(
    id: number,
    data: {
      isCertified: boolean;
      certificateNumber?: string;
      certificationType?: string;
      inspectorNotes?: string;
    },
  ) {
    const listing = await this.listingRepository.findOne({ where: { id } });
    if (!listing) throw new Error('Listing not found');

    listing.isCertified = data.isCertified;
    if (data.certificateNumber) listing.certificateNumber = data.certificateNumber;
    if (data.certificationType) listing.certificationType = data.certificationType;
    if (data.inspectorNotes) listing.inspectorNotes = data.inspectorNotes;
    listing.inspectionDate = new Date().toISOString().split('T')[0];

    return this.listingRepository.save(listing);
  }

  async deleteListing(id: number) {
    const listing = await this.listingRepository.findOne({ where: { id } });
    if (!listing) throw new Error('Listing not found');
    await this.listingRepository.remove(listing);
    return { success: true, message: `Listing ${id} removed by Admin` };
  }

  async getAllListings(status?: ListingStatus) {
    const where = status ? { status } : {};
    return this.listingRepository.find({
      where,
      relations: ['seller', 'images'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllPayments() {
    return this.paymentRepository.find({
      relations: ['buyer', 'listing'],
      order: { createdAt: 'DESC' },
    });
  }
}
