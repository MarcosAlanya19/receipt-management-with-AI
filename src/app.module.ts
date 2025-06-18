import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, validationSchema } from './config/configuration';

import { ReceiptModule } from './receipt/receipt.module';
import { SunatModule } from './sunat/sunat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    SunatModule,
    ReceiptModule,
  ],
})
export class AppModule {}
