import Router from 'express';

import clientesRouter from './clientes.routes.js';
import revendedoresRouter from './revendedores.routes.js';
import produtosRouter from './produtos.routes.js';

const router = Router();

router.use('/clientes', clientesRouter);
router.use('/revendedores', revendedoresRouter);
router.use('/produtos', produtosRouter);

export default router;