import { Module } from '@nestjs/common';

import { SunatModule } from '../sunat/sunat.module';

import { ReceiptService } from './receipt.service';

@Module({
  providers: [ReceiptService],
  imports: [SunatModule],
})
export class ReceiptModule {}
