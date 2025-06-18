export interface ISunatResponse {
  success: boolean;
  message: string;
  data?: {
    name: string;
    status: string;
    condition: string;
    address?: string;
  };
}
