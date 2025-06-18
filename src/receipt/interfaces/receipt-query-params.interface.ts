import { EDocumentType } from '../enum/EDocumentType.enum';
import { EReceiptStatus } from '../enum/EReceiptStatus.enum';

export interface IReceiptQueryParams {
  page?: number;
  pageSize?: number;
  totalPages?: number;
  from?: string;
  to?: string;
  type?: EDocumentType;
  status?: EReceiptStatus;
}
