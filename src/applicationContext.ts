import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ReceiptModule } from './receipt/receipt.module';
import { SunatModule } from './sunat/sunat.module';

import { ReceiptService } from './receipt/receipt.service';
import { SunatService } from './sunat/sunat.service';

// Mounting the application as bare Nest standalone application so that we can use
// the Nest services inside our Encore endpoints
const applicationContext: Promise<{
  receiptService: ReceiptService;
  sunatService: SunatService;
}> = NestFactory.createApplicationContext(AppModule).then((app) => {
  return {
    receiptService: app
      .select(ReceiptModule)
      .get(ReceiptService, { strict: true }),
    sunatService: app.select(SunatModule).get(SunatService, { strict: true }),
  };
});

export default applicationContext;
