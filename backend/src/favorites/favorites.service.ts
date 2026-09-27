import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
import { Listing } from '../entities/listing.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async toggle(listingId: number, userId: number) {
    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException(`Listing #${listingId} not found`);
    }

    const existing = await this.favoriteRepository.findOne({
      where: { listingId, userId },
    });

    if (existing) {
      await this.favoriteRepository.remove(existing);
      return { favorited: false, listingId };
    } else {
      const fav = this.favoriteRepository.create({ listingId, userId });
      await this.favoriteRepository.save(fav);
      return { favorited: true, listingId };
    }
  }

  async findAllForUser(userId: number) {
    const favorites = await this.favoriteRepository.find({
      where: { userId },
      relations: ['listing', 'listing.seller', 'listing.images'],
      order: { createdAt: 'DESC' },
    });
    return favorites.map((f) => f.listing);
  }

  async getFavoriteIds(userId: number): Promise<number[]> {
    const favorites = await this.favoriteRepository.find({
      where: { userId },
      select: ['listingId'],
    });
    return favorites.map((f) => f.listingId);
  }

  async remove(listingId: number, userId: number) {
    const existing = await this.favoriteRepository.findOne({
      where: { listingId, userId },
    });
    if (existing) {
      await this.favoriteRepository.remove(existing);
    }
    return { success: true, listingId };
  }
}
