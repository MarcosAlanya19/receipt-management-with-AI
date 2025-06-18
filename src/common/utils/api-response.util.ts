import { ApiResponse } from '../interfaces/api-response.interface';

export const apiResponse = <T = unknown>({
  status,
  message,
  data,
}: ApiResponse<T>): ApiResponse<T> => ({
  status,
  message,
  data,
});
