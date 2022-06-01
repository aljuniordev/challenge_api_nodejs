import { inject, injectable } from 'tsyringe';
import { AppError } from '@shared/errors';
import { IDateProvider } from '@shared/containers/providers';

import { ICheckBarcodeDTORet } from '@modules/bankSlip/dtos';

interface IRequest {
  barcode: string;
}

@injectable()
class CheckBarcodeUseCase {
  constructor(
    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ barcode: barcodeRaw }: IRequest): Promise<ICheckBarcodeDTORet> {
    if (!barcodeRaw) {
      throw new AppError('missing_parameters');
    }

    const barcode = barcodeRaw.replace('.', '');

    if (barcode.length !== 47) {
      throw new AppError('incorrect_parameters');
    }

    const dateNow = this.dateProvider.dateNow();

    return {
      amount: '1',
      expirationDate: this.dateProvider.dateNow().toISOString(),
      barCode: barcode,
    };
  }
}

export { CheckBarcodeUseCase };
