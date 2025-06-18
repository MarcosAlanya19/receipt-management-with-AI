import { MatchesRegexp, MaxLen, Min, MinLen } from 'encore.dev/validate';
import { EDocumentType } from '../enum/EDocumentType.enum';

type RUC = string & MatchesRegexp<'^[1|2]\\d{10}$'>;

type DNI = string & MatchesRegexp<'^\\d{8}$'>;

export interface ICreateReceiptDto {
  companyId: string & MinLen<3> & MaxLen<20>;
  documentNumber: RUC | DNI;
  invoiceNumber: string & MatchesRegexp<'^[A-Z]{1}\\d{3}-\\d{4}$'>;
  amount: number & Min<0.01>;
  issueDate: string & MatchesRegexp<'^\\d{4}-\\d{2}-\\d{2}$'>;
  documentType: EDocumentType;
}
