import Router from 'express';

import clientesRouter from './clientes.routes.js';

const router = Router();

router.use('/clientes', clientesRouter);

export default router;
