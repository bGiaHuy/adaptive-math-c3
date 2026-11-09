import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, AuthGuard, RolesGuard, GoogleAuthService],
  exports: [AuthService, AuthGuard, RolesGuard]
})
export class AuthModule {}
