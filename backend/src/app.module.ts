import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Listing } from './entities/listing.entity';
import { Image } from './entities/image.entity';
import { Payment } from './entities/payment.entity';
import { Notification } from './entities/notification.entity';
import { AuditLog } from './entities/audit-log.entity';
import { Appointment } from './entities/appointment.entity';
import { Favorite } from './entities/favorite.entity';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ListingsModule } from './listings/listings.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { FavoritesModule } from './favorites/favorites.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3305', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_NAME || 'supercar_marketplace',
      entities: [User, Listing, Image, Payment, Notification, AuditLog, Appointment, Favorite],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UsersModule,
    ListingsModule,
    PaymentsModule,
    AdminModule,
    NotificationsModule,
    AppointmentsModule,
    FavoritesModule,
    SeedModule,
  ],
})
export class AppModule {}
