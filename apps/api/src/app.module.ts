import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { RentcastModule } from './common/rentcast/rentcast.module';
import { PdfModule } from './common/pdf/pdf.module';
import { AuthModule } from './auth/auth.module';
import { ValuationsModule } from './valuations/valuations.module';
import { LeadsModule } from './leads/leads.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Caching
    CacheModule.register({
      isGlobal: true,
      ttl: 86400000, // 24 hours in milliseconds
    }),

    // Task Scheduling
    ScheduleModule.forRoot(),

    // Prisma
    PrismaModule,

    // Common modules
    RentcastModule,
    PdfModule,

    // Feature modules
    AuthModule,
    ValuationsModule,
    LeadsModule,
    SubscriptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
