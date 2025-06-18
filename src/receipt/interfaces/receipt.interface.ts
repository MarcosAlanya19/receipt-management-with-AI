import { EDocumentType } from '../enum/EDocumentType.enum';
import { EReceiptStatus } from '../enum/EReceiptStatus.enum';

export interface IReceipt {
  igv: number;
  total: number;
  id: string;
  companyId: string;
  documentNumber: string;
  invoiceNumber: string;
  amount: number;
  issueDate: Date;
  documentType: EDocumentType;
  reasonObservation: string | null;
  status: EReceiptStatus;
  createdAt: Date;
}
