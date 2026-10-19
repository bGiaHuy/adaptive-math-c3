import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EnglishController } from './english.controller';
import { EnglishService } from './english.service';

@Module({ imports: [AuthModule], controllers: [EnglishController], providers: [EnglishService] })
export class EnglishModule {}
