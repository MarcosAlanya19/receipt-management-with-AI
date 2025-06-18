import {
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { api } from 'encore.dev/api';
import applicationContext from '../applicationContext';
import { ApiResponse } from '../common/interfaces/api-response.interface';

import { apiResponse } from '../common/utils/api-response.util';
import { isValidValue } from '../common/utils/is-valid-value.util';

const { receiptService, openAiService } = await applicationContext;
openAiService.setDependencies(receiptService);

export const aiQueryOpenAI = api<{ prompt: string }, ApiResponse<string>>(
  { expose: true, method: 'POST', path: '/openai/receipts' },
  async ({ prompt }: { prompt: string }) => {
    if (!isValidValue(prompt)) {
      throw new BadRequestException('La consulta no puede estar vacía.');
    }

    try {
      const answer = await openAiService.askQuestion(prompt);

      return apiResponse({
        status: HttpStatus.OK,
        message: 'Respuesta de IA generada correctamente.',
        data: answer,
      });
    } catch (error) {
      console.error('Error al consultar IA:', error);

      throw new InternalServerErrorException(
        'No se pudo obtener respuesta de la IA.',
      );
    }
  },
);
