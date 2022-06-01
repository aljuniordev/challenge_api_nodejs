import { Router } from 'express';

import { bankSlipRoutes } from '@modules/bankSlip/infra/http/routes/bankSlip.routes';

const router = Router();

router.use('/boleto', bankSlipRoutes);

export { router };
