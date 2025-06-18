export interface ICreateReceiptDto {
  companyId: string;
  documentNumber: string;
  invoiceNumber: string;
  amount: number;
  issueDate: string;
  documentType: string;
}
