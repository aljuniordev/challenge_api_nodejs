import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CheckBarcodeUseCase } from './checkBarcode.service';

class CheckBarcodeController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { barcode } = req.params;

    const service = container.resolve(CheckBarcodeUseCase);

    const ret = await service.checkBarcode({ barcode });

    return res.status(200).json(ret);
  }
}

export { CheckBarcodeController };
