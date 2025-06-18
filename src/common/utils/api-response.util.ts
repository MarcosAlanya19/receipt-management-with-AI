import { ApiResponse } from '../interfaces/api-response.interface';
import { isValidValue } from './is-valid-value.util';

export const apiResponse = <T = any>({
  status,
  message,
  data,
  meta,
}: ApiResponse): ApiResponse => ({
  message,
  ...(isValidValue(status) && { status }),
  ...(isValidValue(data) && { data }),
  ...(isValidValue(meta) && { meta }),
});
