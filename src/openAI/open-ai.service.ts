import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async askQuestion(receipts: any[], prompt: string): Promise<string> {
    const context = receipts
      .map(
        (r) =>
          `ID: ${r.id}, Monto: ${r.amount}, Estado: ${r.status}, Fecha: ${r.issueDate}`,
      )
      .join('\n');

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content:
          'Eres un asistente que responde preguntas basadas en datos de comprobantes.',
      },
      {
        role: 'user',
        content: `Aquí están los datos:\n${context}\n\nPregunta: ${prompt}`,
      },
    ];

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    const raw = completion.choices[0].message.content || 'Sin respuesta.';
    const formatted = raw.trim().replace(/\n{2,}/g, '\n');

    return formatted;
  }
}
