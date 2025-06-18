export interface ApiResponse<T> {
  status?: number;
  message: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
}
