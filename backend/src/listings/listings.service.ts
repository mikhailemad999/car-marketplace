import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, Like } from 'typeorm';
import { Listing, ListingStatus } from '../entities/listing.entity';
import { Image, ImageType } from '../entities/image.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { CreateListingDto, UpdateListingDto } from './dto/create-listing.dto';
import { ListingQueryDto } from './dto/listing-query.dto';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async search(query: ListingQueryDto) {
    const qb = this.listingRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.seller', 'seller')
      .leftJoinAndSelect('listing.images', 'images');

    if (query.status) {
      qb.andWhere('listing.status = :status', { status: query.status });
    } else {
      qb.andWhere('listing.status = :status', { status: ListingStatus.PUBLISHED });
    }

    if (query.model) {
      qb.andWhere('listing.model LIKE :model', { model: `%${query.model}%` });
    }

    if (query.color) {
      qb.andWhere('listing.color LIKE :color', { color: `%${query.color}%` });
    }

    if (query.year) {
      qb.andWhere('listing.year = :year', { year: query.year });
    }

    if (query.minPrice !== undefined && query.maxPrice !== undefined) {
      qb.andWhere('listing.price BETWEEN :minPrice AND :maxPrice', {
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
      });
    } else if (query.minPrice !== undefined) {
      qb.andWhere('listing.price >= :minPrice', { minPrice: query.minPrice });
    } else if (query.maxPrice !== undefined) {
      qb.andWhere('listing.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    if (query.search) {
      qb.andWhere('(listing.title LIKE :search OR listing.description LIKE :search OR listing.model LIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const sortCol = ['price', 'year', 'createdAt'].includes(query.sortBy || '')
      ? `listing.${query.sortBy}`
      : 'listing.createdAt';
    const sortDir = query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(sortCol, sortDir);
    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number) {
    const listing = await this.listingRepository.findOne({
      where: { id },
      relations: ['seller', 'images'],
    });

    if (!listing) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }

    return listing;
  }

  async create(dto: CreateListingDto, sellerId: number) {
    const listing = this.listingRepository.create({
      sellerId,
      title: dto.title,
      description: dto.description,
      price: dto.price,
      model: dto.model,
      color: dto.color,
      year: dto.year,
      mileage: dto.mileage !== undefined ? dto.mileage : (dto.specs?.mileage || 0),
      vin: dto.vin || dto.specs?.vin || null,
      sellerPhone: dto.sellerPhone || null,
      certificateNumber: dto.certificateNumber || null,
      isCertified: dto.isCertified !== undefined ? dto.isCertified : true,
      certificationType: dto.certificationType || 'Ferrari Approved 101-Point Inspection',
      inspectionDate: dto.inspectionDate || null,
      inspectorNotes: dto.inspectorNotes || null,
      location: dto.location || 'Maranello, Italy',
      warranty: dto.warranty || 'Ferrari Power15 Warranty Included',
      specs: dto.specs || {},
      status: ListingStatus.PUBLISHED,
    });

    const savedListing = await this.listingRepository.save(listing);

    if (dto.images && dto.images.length > 0) {
      const imagesToSave = dto.images.map((img) =>
        this.imageRepository.create({
          listingId: savedListing.id,
          url: img.url,
          type: (img.type as ImageType) || ImageType.PHOTO,
        }),
      );
      await this.imageRepository.save(imagesToSave);
    }

    // Log action
    await this.auditLogRepository.save(
      this.auditLogRepository.create({
        userId: sellerId,
        action: 'CREATE_LISTING',
        entity: 'listing',
        entityId: savedListing.id,
        details: { title: savedListing.title, price: savedListing.price },
      }),
    );

    return this.findById(savedListing.id);
  }

  async update(id: number, dto: UpdateListingDto, userId: number, userRole: UserRole) {
    const listing = await this.findById(id);

    if (userRole !== UserRole.ADMIN && listing.sellerId !== userId) {
      throw new ForbiddenException('You do not have permission to modify this listing');
    }

    Object.assign(listing, dto);
    const updated = await this.listingRepository.save(listing);

    // Audit log
    await this.auditLogRepository.save(
      this.auditLogRepository.create({
        userId,
        action: 'UPDATE_LISTING',
        entity: 'listing',
        entityId: id,
        details: dto,
      }),
    );

    return updated;
  }

  async remove(id: number, userId: number, userRole: UserRole) {
    const listing = await this.findById(id);

    if (userRole !== UserRole.ADMIN && listing.sellerId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this listing');
    }

    await this.listingRepository.remove(listing);

    // Audit log
    await this.auditLogRepository.save(
      this.auditLogRepository.create({
        userId,
        action: 'DELETE_LISTING',
        entity: 'listing',
        entityId: id,
        details: { title: listing.title },
      }),
    );

    return { success: true, message: `Listing ${id} deleted` };
  }
}
