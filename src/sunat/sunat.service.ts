import { Injectable } from '@nestjs/common';
import { DocumentType } from '@prisma/client';
import { SunatValidationDto } from './dto/sunat-validation.dto';
import { SunatResponse } from './interfaces/sunat-response.interface';

@Injectable()
export class SunatService {
  validateSunatData({ type, value }: SunatValidationDto): SunatResponse {
    console.log('Validating SUNAT data:', { type, value });
    if (type === DocumentType.RUC) {
      if (value === '20123456789') {
        return {
          success: true,
          message: 'Valid RUC',
          data: {
            name: 'EMPRESA SAC',
            status: 'ACTIVE',
            condition: 'HABIDO',
            address: '123 PERU AVE',
          },
        };
      }

      return {
        success: false,
        message: 'RUC not found',
      };
    }

    if (type === DocumentType.DNI) {
      if (value === '12345678') {
        return {
          success: true,
          message: 'Valid DNI',
          data: {
            name: 'JUAN PEREZ',
            status: 'ACTIVE',
            condition: 'HABIDO',
          },
        };
      }

      return {
        success: false,
        message: 'DNI not found',
      };
    }

    return {
      success: false,
      message: 'Invalid document type',
    };
  }
}
