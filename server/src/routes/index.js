import Router from 'express';

import clientesRouter from './clientes.routes.js';
import revendedoresRouter from './revendedores.routes.js';

const router = Router();

router.use('/clientes', clientesRouter);
router.use('/revendedores', revendedoresRouter);

export default router;
