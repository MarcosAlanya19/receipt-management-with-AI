import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { ReceiptService } from '../receipt/receipt.service';

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;

  constructor(private receiptService: ReceiptService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  setDependencies(receiptService: ReceiptService) {
    this.receiptService = receiptService;
  }

  /**
   * Consulta el modelo GPT de OpenAI usando como contexto un CSV con información de recibos.
   *
   * @param prompt Texto de la pregunta del usuario (debe estar en lenguaje natural y estar relacionada con los datos del CSV).
   * @returns La respuesta generada por el modelo GPT como un string limpio y formateado.
   * @throws {InternalServerErrorException} Si la llamada a la API de OpenAI falla o si no se recibe una respuesta válida.
   */
  async askQuestion(prompt: string): Promise<string> {
    const receiptsCsv = await this.receiptService.exportToCsv({});
    const csv = Buffer.from(receiptsCsv, 'base64').toString('utf-8');

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `
            Eres un analista financiero inteligente y preciso.
            Tienes acceso a la información completa de ingresos, egresos y operaciones contables de una empresa.
            Responde con claridad, sin mencionar el origen de los datos, y redacta respuestas limpias, sin comillas ni formato de código.
            Utiliza un lenguaje profesional, pero comprensible.
        `,
      },
      {
        role: 'user',
        content: `Pregunta: ${prompt}\n\nDatos:\n\n${csv}`,
      },
    ];

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0.2,
      });

      const raw = completion.choices?.[0]?.message?.content ?? 'Sin respuesta.';
      return raw.trim().replace(/\n{2,}/g, '\n');
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw new InternalServerErrorException(
        'Error OpenAI API. Please try again later.',
      );
    }
  }
}
