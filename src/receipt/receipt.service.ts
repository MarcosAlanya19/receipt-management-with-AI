import { BadRequestException, Injectable } from '@nestjs/common';
import { ReceiptStatus } from '@prisma/client';
import { prisma } from '../prisma/database';

import { SunatService } from '../sunat/sunat.service';

import { ICreateReceiptDto } from './dto/create-receipt.dto';
import { IUpdateStatusReceiptDto } from './dto/update-status-receipt.dto';
import { EDocumentType } from './enum/EDocumentType.enum';
import { EReceiptStatus } from './enum/EReceiptStatus.enum';
import { IReceiptQueryParams } from './interfaces/receipt-query-params.interface';

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

  async findAll(query: IReceiptQueryParams) {
    const { page = 1, pageSize = 10, from, to, type, status } = query;

    const skip = (Number(page) - 1) * Number(pageSize);
    const where: any = {};

    if (from && to) {
      where.issueDate = { gte: new Date(from), lte: new Date(to) };
    }

    if (type) where.documentType = type;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.receipt.findMany({
        where,
        skip,
        take: Number(pageSize),
        orderBy: { issueDate: 'desc' },
      }),
      prisma.receipt.count({ where }),
    ]);

    const totalPages = Math.ceil(total / Number(pageSize));

    return {
      data,
      meta: {
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages,
      },
    };
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

  async exportToCsv(query: IReceiptQueryParams): Promise<string> {
    const { from, to, type, status } = query;

    const where: any = {};

    if (from && to) {
      where.issueDate = { gte: new Date(from), lte: new Date(to) };
    }

    if (type) where.documentType = type;
    if (status) where.status = status;

    const receipts = await prisma.receipt.findMany({
      where,
      orderBy: { issueDate: 'desc' },
    });

    const headers = ['ID', 'Monto', 'IGV', 'Total', 'Estado', 'Fecha'];
    const rows = receipts.map((r) => {
      const igv = r.amount * 0.18;
      const total = r.amount + igv;
      const estado = this.mapStatus(r.status);
      return [
        r.id,
        r.amount.toFixed(2),
        igv.toFixed(2),
        total.toFixed(2),
        estado,
        new Date(r.issueDate).toLocaleDateString(),
      ];
    });

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

    // Si necesitas base64 para el frontend
    return Buffer.from(csv).toString('base64');
  }

  private mapStatus(status: ReceiptStatus): string {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'OBSERVED':
        return 'Observado';
      case 'REJECTED':
        return 'Rechazado';
      case 'VALIDATED':
        return 'Validado';
      default:
        return status;
    }
  }
}
