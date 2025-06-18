import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, validationSchema } from './config';

import { OpenAiModule } from './openAI/open-ai.module';
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
    OpenAiModule,
  ],
})
export class AppModule {}
