import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

class GrantCreditsDto {
  email: string;
  amount: number;
}

class PreregisterDto {
  email: string;
}

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  @ApiOperation({ summary: 'Listar todos los usuarios (solo admin)' })
  async getUsers() {
    return this.authService.getUsersList();
  }

  @Post('credits')
  @ApiOperation({ summary: 'Otorgar créditos a un usuario por email (solo admin)' })
  async grantCredits(@Request() req, @Body() dto: GrantCreditsDto) {
    const amount = Number(dto.amount) || 15;
    return this.authService.grantCredits(req.user.userId, dto.email, amount);
  }

  @Post('preregister')
  @ApiOperation({ summary: 'Pre-registrar usuario: envía email con invitación y 15 créditos (solo admin)' })
  async preregister(@Request() req, @Body() dto: PreregisterDto) {
    return this.authService.preregister(req.user.userId, dto.email);
  }
}

