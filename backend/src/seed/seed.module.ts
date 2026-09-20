import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../entities/user.entity';
import { Listing } from '../entities/listing.entity';
import { Image } from '../entities/image.entity';
import { AuditLog } from '../entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Listing, Image, AuditLog])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
