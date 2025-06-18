import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { OpenAiService } from '../openAI/open-ai.service';

@Module({
  providers: [OpenAiService],
  exports: [OpenAiService],
  imports: [HttpModule],
})
export class OpenAiModule {}
