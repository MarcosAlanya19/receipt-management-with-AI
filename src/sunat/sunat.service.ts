import { Injectable } from '@nestjs/common';
import { EDocumentType } from '../receipt/enum/EDocumentType.enum';
import { ISunatValidationDto } from './dto/sunat-validation.dto';
import { ISunatResponse } from './interfaces/sunat-response.interface';

@Injectable()
export class SunatService {
  validateSunatData({ type, value }: ISunatValidationDto): ISunatResponse {
    console.log('Validating SUNAT data:', { type, value });

    if (type === EDocumentType.RUC && !/^[1|2]\d{10}$/.test(value)) {
      return { success: false };
    }

    if (type === EDocumentType.DNI && !/^\d{8}$/.test(value)) {
      return { success: false };
    }

    if (type === EDocumentType.RUC) {
      if (value === '20123456789') {
        return {
          success: true,
          name: 'EMPRESA SAC',
          status: 'ACTIVE',
          condition: 'HABIDO',
          address: '123 PERU AVE',
        };
      }

      if (value === '20456789012') {
        return {
          success: true,
          name: 'EMPRESA INACTIVA SAC',
          status: 'INACTIVE',
          condition: 'NO HABIDO',
          address: 'AV. LOS ROBLES 456',
        };
      }

      return { success: false };
    }

    if (type === EDocumentType.DNI) {
      if (value === '12345678') {
        return {
          success: true,
          name: 'JUAN PEREZ',
          status: 'ACTIVE',
          condition: 'HABIDO',
        };
      }

      if (value === '87654321') {
        return {
          success: true,
          name: 'MARIA LOPEZ',
          status: 'INACTIVE',
          condition: 'HABIDO',
        };
      }

      return { success: false };
    }

    return { success: false };
  }
}
