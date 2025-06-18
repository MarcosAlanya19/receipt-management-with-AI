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

const { receiptService, sunatService } = await applicationContext;
receiptService.setDependencies(sunatService);

export const createReceipt = api<ICreateReceiptDto, ICreateReceiptResponse>(
  {
    method: 'POST',
    path: '/receipt',
    expose: true,
  },
  async (params): Promise<ICreateReceiptResponse> => {
    const receipt = await receiptService.create(params);

    return apiResponse({
      message: 'Receipt created successfully',
      data: receipt,
      status: HttpStatus.OK,
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
    const { page, pageSize, from, to, type, status } = query;

    const receipts = await receiptService.findAll({
      page: page || 1,
      pageSize: pageSize || 10,
      ...(isValidValue(from) && isValidValue(to) && { from, to }),
      ...(isValidValue(type) && { type }),
      ...(isValidValue(status) && { status }),
    });

    return apiResponse({
      status: HttpStatus.OK,
      message: 'Receipts fetched successfully',
      data: receipts.data ?? [],
      meta: receipts.meta,
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
    const receipt = await receiptService.updateStatus(id, dto);

    return apiResponse({
      status: HttpStatus.OK,
      message: 'Receipt status updated successfully',
      data: receipt,
    });
  },
);

export const exportReceiptsCsv = api<IReceiptQueryParams, ApiResponse>(
  { expose: true, method: 'GET', path: '/receipts/export' },
  async (query: IReceiptQueryParams) => {
    const { receiptService } = await applicationContext;
    const csvBase64 = await receiptService.exportToCsv(query);

    return apiResponse({
      status: 200,
      message: 'Receipts exported successfully',
      data: csvBase64,
    });
  },
);
