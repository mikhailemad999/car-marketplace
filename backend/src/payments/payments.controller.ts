import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN)
  @Post()
  async create(@Body() dto: CreatePaymentDto, @Request() req: any) {
    return this.paymentsService.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyPayments(@Request() req: any) {
    return this.paymentsService.findByBuyer(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll() {
    return this.paymentsService.findAll();
  }
}
