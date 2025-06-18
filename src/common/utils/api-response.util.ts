import { ApiResponse } from '../interfaces/api-response.interface';
import { isValidValue } from './is-valid-value.util';

export const apiResponse = <T>({
  status,
  message,
  data,
  meta,
}: ApiResponse<T>): ApiResponse<T> => ({
  message,
  ...(isValidValue(status) && { status }),
  ...(isValidValue(data) && { data }),
  ...(isValidValue(meta) && { meta }),
});
