import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentType, ReceiptStatus } from '@prisma/client';
import currency from 'currency.js';
import { DateTime } from 'luxon';
import { prisma } from '../prisma/database';

import { SunatService } from '../sunat/sunat.service';

import { ICreateReceiptDto } from './dto/create-receipt.dto';
import { IUpdateStatusReceiptDto } from './dto/update-status-receipt.dto';

import { EDocumentType } from './enum/EDocumentType.enum';
import { IReceiptQueryParams } from './interfaces/receipt-query-params.interface';

@Injectable()
export class ReceiptService {
  constructor(private sunatService: SunatService) {}
  setDependencies(sunatService: SunatService) {
    this.sunatService = sunatService;
  }

  /**
   * Crea un nuevo recibo en el sistema.
   *
   * Validaciones:
   * - Verifica que el documento exista usando el servicio SUNAT.
   * - Calcula el IGV y el total usando `ReceiptCalculator`.
   *
   * @param createReceiptDto Datos del recibo a registrar.
   * @returns El recibo creado.
   * @throws BadRequestException Si el documento no existe.
   */
  async create(createReceiptDto: ICreateReceiptDto) {
    const validationSunat = this.sunatService.validateSunatData({
      type: createReceiptDto.documentType as EDocumentType,
      value: createReceiptDto.documentNumber,
    });

    if (!validationSunat.success) {
      throw new BadRequestException('Documento no encontrado');
    }

    const { igv, total } = this.calculateAmounts(createReceiptDto.amount);

    return await prisma.receipt.create({
      data: {
        ...createReceiptDto,
        igv,
        total,
        status: ReceiptStatus.PENDING,
        issueDate: DateTime.fromISO(createReceiptDto.issueDate).toJSDate(),
        documentType: createReceiptDto.documentType as DocumentType,
      },
    });
  }

  /**
   * Obtiene una lista paginada de recibos según filtros opcionales.
   *
   * Filtros disponibles:
   * - Rango de fechas (`from`, `to`)
   * - Tipo de documento (`type`)
   * - Estado del recibo (`status`)
   *
   * La paginación incluye metainformación: total de elementos, página actual y total de páginas.
   *
   * @param query Parámetros de búsqueda y paginación.
   * @returns Lista de recibos y metadatos de paginación.
   */
  async findAll(query: IReceiptQueryParams) {
    const { page = 1, pageSize = 10, from, to, type, status } = query;
    const skip = (page - 1) * pageSize;
    const where: any = {};

    if (from && to) {
      where.issueDate = {
        gte: DateTime.fromISO(from).toJSDate(),
        lte: DateTime.fromISO(to).toJSDate(),
      };
    }
    if (type) where.documentType = type;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.receipt.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { issueDate: 'desc' },
      }),
      prisma.receipt.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Actualiza el estado de un recibo específico.
   *
   * Validaciones:
   * - Verifica que el recibo exista previamente.
   *
   * @param id ID del recibo a actualizar.
   * @param dto Datos con el nuevo estado.
   * @returns El recibo actualizado.
   * @throws BadRequestException Si el recibo no existe.
   */
  async updateStatus(id: string, dto: IUpdateStatusReceiptDto) {
    await this.findOne(id);
    return await prisma.receipt.update({
      data: { status: dto.status as ReceiptStatus },
      where: { id },
    });
  }

  /**
   * Exporta los recibos como archivo CSV codificado en Base64.
   *
   * Filtra por fecha, tipo y estado.
   * Usa `ReceiptCalculator` para calcular IGV y Total por fila.
   * Usa `luxon` para formato de fechas.
   *
   * @param query Parámetros de búsqueda.
   * @returns CSV como string en base64.
   */
  async exportToCsv(query: IReceiptQueryParams): Promise<string> {
    const { from, to, type, status } = query;

    const where: any = {};

    if (from) {
      where.issueDate = {
        ...(where.issueDate || {}),
        gte: DateTime.fromISO(from).toJSDate(),
      };
    }
    if (to) {
      where.issueDate = {
        ...(where.issueDate || {}),
        lte: DateTime.fromISO(to).toJSDate(),
      };
    }
    if (type) where.documentType = type;
    if (status) where.status = status;

    const receipts = await prisma.receipt.findMany({
      where,
      orderBy: { issueDate: 'desc' },
    });

    const csv = [this.csvHeaders(), ...receipts.map((r) => this.toCsvRow(r))]
      .map((r) => r.join(','))
      .join('\n');

    return Buffer.from(csv).toString('base64');
  }

  private calculateAmounts(amount: number) {
    const base = currency(amount);
    const igv = base.multiply(0.18);
    const total = base.add(igv);
    return { igv: igv.value, total: total.value };
  }

  private toCsvRow(receipt: any): string[] {
    const { igv, total } = this.calculateAmounts(receipt.amount);
    return [
      receipt.companyId,
      receipt.documentNumber,
      receipt.invoiceNumber,
      receipt.amount.toFixed(2),
      igv.toFixed(2),
      total.toFixed(2),
      this.mapStatus(receipt.status),
      DateTime.fromJSDate(receipt.issueDate).toFormat('dd/MM/yyyy'),
    ];
  }

  private csvHeaders(): string[] {
    return [
      'Empresa ID',
      'Nro. Documento',
      'Nro. Factura',
      'Monto',
      'IGV',
      'Total',
      'Estado',
      'Fecha de Emisión',
    ];
  }

  async findOne(id: string) {
    const findReceipt = await prisma.receipt.findUnique({ where: { id } });
    if (!findReceipt) {
      throw new BadRequestException(`Receipt with id ${id} not found`);
    }
    return findReceipt;
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
