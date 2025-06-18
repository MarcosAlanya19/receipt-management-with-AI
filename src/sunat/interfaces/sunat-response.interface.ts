export interface ISunat {
  name?: string;
  status?: string;
  condition?: string;
  address?: string;
  success: boolean;
}

export type ISunatResponse = ISunat;
