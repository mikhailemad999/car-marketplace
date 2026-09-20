import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Image } from './image.entity';
import { Payment } from './payment.entity';

export enum ListingStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SOLD = 'sold',
  ARCHIVED = 'archived',
}

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'seller_id' })
  sellerId: number;

  @ManyToOne(() => User, (user) => user.listings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: ListingStatus,
    default: ListingStatus.PUBLISHED,
  })
  status: ListingStatus;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int', default: 0 })
  mileage: number; // in miles

  @Column({ nullable: true })
  vin: string;

  @Column({ name: 'seller_phone', nullable: true })
  sellerPhone: string;

  @Column({ name: 'certificate_number', nullable: true })
  certificateNumber: string;

  @Column({ name: 'is_certified', default: true })
  isCertified: boolean;

  @Column({ name: 'certification_type', default: 'Ferrari Approved 101-Point Inspection' })
  certificationType: string;

  @Column({ name: 'inspection_date', nullable: true })
  inspectionDate: string;

  @Column({ name: 'inspector_notes', type: 'text', nullable: true })
  inspectorNotes: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  warranty: string;

  @Column({ type: 'json', nullable: true })
  specs: {
    engine?: string;
    horsepower?: number;
    acceleration?: string; // e.g. 2.5s 0-100 km/h
    topSpeed?: string; // e.g. 340 km/h
    transmission?: string;
    drivetrain?: string;
    mileage?: number;
    vin?: string;
    hybridSystem?: string;
    downforce?: string;
  };

  @OneToMany(() => Image, (image) => image.listing, { cascade: true })
  images: Image[];

  @OneToMany(() => Payment, (payment) => payment.listing)
  payments: Payment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
