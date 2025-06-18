import { BadRequestException, Injectable } from '@nestjs/common';
import { ReceiptStatus } from '@prisma/client';
import { prisma } from '../prisma/database';

import { SunatService } from '../sunat/sunat.service';

import { ICreateReceiptDto } from './dto/create-receipt.dto';
import { IUpdateStatusReceiptDto } from './dto/update-status-receipt.dto';
import { EDocumentType } from './enum/EDocumentType.enum';
import { EReceiptStatus } from './enum/EReceiptStatus.enum';

@Injectable()
export class ReceiptService {
  constructor(private sunatService: SunatService) {}
  setDependencies(sunatService: SunatService) {
    this.sunatService = sunatService;
  }

  async create(createReceiptDto: ICreateReceiptDto) {
    const validationSunat = this.sunatService.validateSunatData({
      type: createReceiptDto.documentType.toString(),
      value: createReceiptDto.documentNumber,
    });

    if (!validationSunat.success) {
      throw new BadRequestException('Document not found');
    }

    const igv = Number((createReceiptDto.amount * 0.18).toFixed(2));
    const total = Number((createReceiptDto.amount + igv).toFixed(2));

    const receipt = await prisma.receipt.create({
      data: {
        ...createReceiptDto,
        igv,
        total,
        status: ReceiptStatus.PENDING,
        issueDate: new Date(createReceiptDto.issueDate),
        documentType: createReceiptDto.documentType as EDocumentType,
      },
    });

    return receipt;
  }

  async findOne(id: string) {
    const findReceipt = await prisma.receipt.findUnique({ where: { id } });
    if (!findReceipt) {
      throw new BadRequestException(`Receipt with id ${id} not found`);
    }
    return findReceipt;
  }

  async updateStatus(id: string, updateReceiptDto: IUpdateStatusReceiptDto) {
    const receipt = await this.findOne(id);
    const receiptUpdated = await prisma.receipt.update({
      data: {
        ...receipt,
        status: updateReceiptDto.status as EReceiptStatus,
      },
      where: { id },
    });
    return receiptUpdated;
  }

  async remove(id: string) {
    const receiptRemoved = await prisma.receipt.delete({
      where: { id },
    });
    return receiptRemoved;
  }
}
