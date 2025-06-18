export interface ApiResponse {
  status?: number;
  message: string;
  data?: any;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
}
