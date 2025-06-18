import { HttpStatus } from '@nestjs/common';
import { api } from 'encore.dev/api';
import applicationContext from '../applicationContext';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { apiResponse } from '../common/utils/api-response.util';

const { receiptService, openAiService } = await applicationContext;

export const aiQueryOpenAI = api<{ prompt: string }, ApiResponse>(
  { expose: true, method: 'POST', path: '/openai/receipts' },
  async ({ prompt }: { prompt: string }) => {
    const receipts = await receiptService.findAll({});
    const answer = await openAiService.askQuestion(receipts.data, prompt);

    return apiResponse({
      status: HttpStatus.OK,
      message: 'Respuesta de IA generada',
      data: answer,
    });
  },
);
