import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { ListingStatus } from '../entities/listing.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('analytics')
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('audit-logs')
  async getAuditLogs(@Query('limit') limit?: string) {
    return this.adminService.getAuditLogs(limit ? parseInt(limit, 10) : 50);
  }

  @Get('listings')
  async getAllListings(@Query('status') status?: ListingStatus) {
    return this.adminService.getAllListings(status);
  }

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/role')
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: UserRole,
  ) {
    return this.adminService.updateUserRole(id, role);
  }

  @Patch('listings/:id/certify')
  async certifyListing(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    data: {
      isCertified: boolean;
      certificateNumber?: string;
      certificationType?: string;
      inspectorNotes?: string;
    },
  ) {
    return this.adminService.certifyListing(id, data);
  }

  @Delete('listings/:id')
  async deleteListing(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteListing(id);
  }

  @Get('payments')
  async getAllPayments() {
    return this.adminService.getAllPayments();
  }
}
