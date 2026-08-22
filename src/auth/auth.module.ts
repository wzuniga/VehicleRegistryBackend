import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminController } from './admin.controller';
import { User } from './entities/user.entity';
import { CreditTransaction } from './entities/credit-transaction.entity';
import { Invitation } from './entities/invitation.entity';
import { JWT_CONFIG } from '../config/jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { RolesGuard } from './roles.guard';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([User, CreditTransaction, Invitation]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || JWT_CONFIG.secret,
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') || JWT_CONFIG.expiresIn },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, RolesGuard, MailService],
  controllers: [AuthController, AdminController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

