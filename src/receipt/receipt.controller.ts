import { HttpStatus } from '@nestjs/common';
import { api } from 'encore.dev/api';
import applicationContext from '../applicationContext';

import { apiResponse } from '../common/utils/api-response.util';
import { isValidValue } from '../common/utils/is-valid-value.util';

import { ICreateReceiptDto } from './dto/create-receipt.dto';
import { IUpdateStatusReceiptDto } from './dto/update-status-receipt.dto';

import { ApiResponse } from '../common/interfaces/api-response.interface';
import { ICreateReceiptResponse } from './interfaces/create-receipt-response.interface';
import { IReceiptQueryParams } from './interfaces/receipt-query-params.interface';
import { IReceiptResponse } from './interfaces/receipt-response.interface';
import { IReceipt } from './interfaces/receipt.interface';

const { receiptService, sunatService } = await applicationContext;
receiptService.setDependencies(sunatService);

export const createReceipt = api<ICreateReceiptDto, ICreateReceiptResponse>(
  {
    method: 'POST',
    path: '/receipt',
    expose: true,
  },
  async (dto): Promise<ICreateReceiptResponse> => {
    const createdReceipt = (await receiptService.create(dto)) as IReceipt;

    return apiResponse({
      message: 'Recepción creada correctamente',
      status: HttpStatus.CREATED,
      data: createdReceipt,
    });
  },
);

export const findAllReceipts = api<IReceiptQueryParams, IReceiptResponse>(
  {
    method: 'GET',
    path: '/receipt',
    expose: true,
  },
  async (query: IReceiptQueryParams): Promise<IReceiptResponse> => {
    const { page = 1, pageSize = 10, from, to, type, status } = query;

    const filters: IReceiptQueryParams = {
      page,
      pageSize,
      ...(isValidValue(from) && isValidValue(to) && { from, to }),
      ...(isValidValue(type) && { type }),
      ...(isValidValue(status) && { status }),
    };

    const { data, meta } = await receiptService.findAll(filters);

    return apiResponse({
      status: HttpStatus.OK,
      message: 'Recepciones obtenidas correctamente',
      data: data as IReceipt[],
      meta,
    });
  },
);

export const updateStatusReceipt = api<
  { id: string } & IUpdateStatusReceiptDto,
  ICreateReceiptResponse
>(
  {
    method: 'PUT',
    path: '/receipt/:id',
    expose: true,
  },
  async ({
    id,
    ...dto
  }: {
    id: string;
  } & IUpdateStatusReceiptDto): Promise<ICreateReceiptResponse> => {
    const updatedReceipt = (await receiptService.updateStatus(
      id,
      dto,
    )) as IReceipt;

    return apiResponse({
      status: HttpStatus.OK,
      message: `Estado de la recepción actualizado a ${updatedReceipt.status}`,
      data: updatedReceipt,
    });
  },
);

export const exportReceiptsCsv = api<IReceiptQueryParams, ApiResponse<string>>(
  {
    method: 'GET',
    path: '/receipts/export',
    expose: true,
  },
  async (query) => {
    const csvBase64 = await receiptService.exportToCsv(query);

    return apiResponse({
      message: 'Recepciones exportadas correctamente',
      status: HttpStatus.OK,
      data: csvBase64,
    });
  },
);
