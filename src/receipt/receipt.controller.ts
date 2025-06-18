import { HttpStatus } from '@nestjs/common';
import { api } from 'encore.dev/api';
import applicationContext from '../applicationContext';

import { ICreateReceiptResponse } from './interfaces/create-receipt-response';

import { ICreateReceiptDto } from './dto/create-receipt.dto';
import { IUpdateStatusReceiptDto } from './dto/update-status-receipt.dto';

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
    return {
      message: 'Receipt created successfully',
      data: receipt,
      status: HttpStatus.OK,
    };
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
    return {
      message: 'Receipt status updated successfully',
      data: receipt,
      status: HttpStatus.OK,
    };
  },
);

// export const listUsers = api<void, ListUsersResponse>(
//   { method: 'GET', path: '/users' },
//   async () => {
//     const { userService } = await applicationContext;
//     const users = await userService.findAll();
//     return { users };
//   }
// );
