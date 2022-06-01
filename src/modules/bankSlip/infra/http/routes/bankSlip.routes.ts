import { Router } from 'express';
import { CheckBarcodeController } from '@modules/bankSlip/useCases/checkBarcode/checkBarcode.controller';

const bankSlipRoutes = Router();

const createRentController = new CheckBarcodeController();

bankSlipRoutes.get('/:barcode', createRentController.handle);

export { bankSlipRoutes };
