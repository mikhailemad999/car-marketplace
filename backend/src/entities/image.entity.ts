import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Listing } from './listing.entity';

export enum ImageType {
  PHOTO = 'photo',
  MODEL_3D = 'model3D',
}

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'listing_id' })
  listingId: number;

  @ManyToOne(() => Listing, (listing) => listing.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listing_id' })
  listing: Listing;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: ImageType,
    default: ImageType.PHOTO,
  })
  type: ImageType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
