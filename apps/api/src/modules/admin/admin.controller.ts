import { Controller, Get, Query, Res, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { User } from '../../common/decorators/user.decorator';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  private readonly logger = new Logger('Admin');

  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get global platform stats' })
  getStats(@User('email') email: string) {
    this.logger.log(`${email} accessed GET /admin/stats`);
    return this.adminService.getGlobalStats();
  }

  @Get('retention')
  @ApiOperation({ summary: 'Get retention cohorts (J1/J7/J30)' })
  getRetention(@User('email') email: string) {
    this.logger.log(`${email} accessed GET /admin/retention`);
    return this.adminService.getRetention();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get paginated user list with stats' })
  getUsers(
    @User('email') email: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    this.logger.log(`${email} accessed GET /admin/users?page=${page || 1}`);
    return this.adminService.getUsers(
      parseInt(page || '1', 10),
      parseInt(limit || '20', 10),
    );
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get daily activity for last N days' })
  getActivity(
    @User('email') email: string,
    @Query('days') days?: string,
  ) {
    this.logger.log(`${email} accessed GET /admin/activity`);
    return this.adminService.getDailyActivity(
      parseInt(days || '30', 10),
    );
  }

  @Get('conversions')
  @ApiOperation({ summary: 'Get conversion funnel stats' })
  getConversions(@User('email') email: string) {
    this.logger.log(`${email} accessed GET /admin/conversions`);
    return this.adminService.getConversionStats();
  }

  @Get('subscriptions')
  @ApiOperation({ summary: 'Get subscription distribution stats' })
  getSubscriptions(@User('email') email: string) {
    this.logger.log(`${email} accessed GET /admin/subscriptions`);
    return this.adminService.getSubscriptionStats();
  }

  @Get('top-matches')
  @ApiOperation({ summary: 'Get most matched movies globally' })
  getTopMatches(
    @User('email') email: string,
    @Query('limit') limit?: string,
  ) {
    this.logger.log(`${email} accessed GET /admin/top-matches`);
    return this.adminService.getTopMatches(parseInt(limit || '10', 10));
  }

  @Get('export/users')
  @ApiOperation({ summary: 'Export users as CSV' })
  async exportUsers(
    @User('email') email: string,
    @Res() res: Response,
  ) {
    this.logger.log(`${email} exported users CSV`);
    const { data } = await this.adminService.getUsers(1, 10000);

    const header = 'Name,Email,Joined,Swipes,Rooms,Last Active\n';
    const rows = data
      .map(
        (u) =>
          `"${u.name || ''}","${u.email}","${new Date(u.createdAt).toISOString().split('T')[0]}",${u.swipesCount},${u.roomsCount},"${u.lastActive ? new Date(u.lastActive).toISOString().split('T')[0] : 'Never'}"`,
      )
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=users-${new Date().toISOString().split('T')[0]}.csv`,
    );
    res.send(header + rows);
  }

  @Get('export/activity')
  @ApiOperation({ summary: 'Export daily activity as CSV' })
  async exportActivity(
    @User('email') email: string,
    @Query('days') days: string,
    @Res() res: Response,
  ) {
    this.logger.log(`${email} exported activity CSV`);
    const { days: data } = await this.adminService.getDailyActivity(
      parseInt(days || '30', 10),
    );

    const header = 'Date,Swipes,Matches,New Users,New Rooms\n';
    const rows = data
      .map((d) => `${d.date},${d.swipes},${d.matches},${d.newUsers},${d.newRooms}`)
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=activity-${new Date().toISOString().split('T')[0]}.csv`,
    );
    res.send(header + rows);
  }
}
